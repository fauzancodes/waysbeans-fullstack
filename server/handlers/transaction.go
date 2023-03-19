package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
	dto "waysbeans/dto/result"
	transactionsdto "waysbeans/dto/transaction"
	"waysbeans/models"
	"waysbeans/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"gopkg.in/gomail.v2"
)

type handlerTransaction struct {
	TransactionRepository repositories.TransactionRepository
	UserRepository        repositories.UserRepository
	ProductRepository     repositories.ProductRepository
	CartRepository        repositories.CartRepository
}

func HandlerTransaction(TransactionRepository repositories.TransactionRepository, UserRepository repositories.UserRepository, ProductRepository repositories.ProductRepository, CartRepository repositories.CartRepository) *handlerTransaction {
	return &handlerTransaction{
		TransactionRepository: TransactionRepository,
		UserRepository:        UserRepository,
		ProductRepository:     ProductRepository,
		CartRepository:        CartRepository,
	}
}

func (h *handlerTransaction) FindTransactions(c echo.Context) error {
	transactions, err := h.TransactionRepository.FindTransactions()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	if len(transactions) > 0 {
		return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Data for all transactions was successfully obtained", Data: transactions})
	} else {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: "No record found"})
	}
}

func (h *handlerTransaction) GetTransaction(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Transaction data successfully obtained", Data: transaction})
}

func (h *handlerTransaction) CreateTransaction(c echo.Context) error {
	request := new(transactionsdto.TransactionRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	user, err := h.UserRepository.GetUser(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}
	userCart := user.Cart
	totalQuantity := 0
	for _, cart := range userCart {
		totalQuantity += cart.OrderQuantity
	}
	totalPrice := 0
	for _, cart := range userCart {
		product, err := h.ProductRepository.GetProduct(cart.ProductID)
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
		}
		multiplied := cart.OrderQuantity * product.Price
		totalPrice += multiplied
	}

	var userTransaction models.UserTransactionResponse
	userTransaction.ID = user.ID
	userTransaction.Name = user.Name
	userTransaction.Email = user.Email

	var productTransaction []models.ProductTransaction
	for _, cart := range userCart {
		product, err := h.ProductRepository.GetProduct(cart.ProductID)
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
		}
		var cartNew models.ProductTransaction
		cartNew.ProductID = product.ID
		cartNew.ProductName = product.Name
		cartNew.ProductPhoto = product.Photo
		cartNew.ProductPrice = product.Price
		cartNew.OrderQuantity = cart.OrderQuantity
		productTransaction = append(productTransaction, cartNew)
	}

	var transactionIsMatch = false
	var transactionId int
	for !transactionIsMatch {
		transactionId = int(time.Now().Unix())
		transactionData, _ := h.TransactionRepository.GetTransaction(transactionId)
		if transactionData.ID == 0 {
			transactionIsMatch = true
		}
	}

	transaction := models.Transaction{
		ID:                 transactionId,
		UserID:             int(userId),
		User:               userTransaction,
		Name:               request.Name,
		Email:              request.Email,
		Phone:              request.Phone,
		Address:            request.Address,
		ProductTransaction: productTransaction,
		TotalQuantity:      totalQuantity,
		TotalPrice:         totalPrice,
		Status:             "pending",
	}
	fmt.Println(transaction)

	dataTransactions, err := h.TransactionRepository.CreateTransaction(transaction)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)

	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(dataTransactions.ID),
			GrossAmt: int64(dataTransactions.TotalPrice),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: dataTransactions.Name,
			Email: dataTransactions.Email,
			Phone: dataTransactions.Phone,
		},
	}

	snapResp, _ := s.CreateTransaction(req)

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Data: snapResp})
}

func (h *handlerTransaction) Notification(c echo.Context) error {
	var notificationPayload map[string]interface{}

	if err := c.Bind(&notificationPayload); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId := notificationPayload["order_id"].(string)

	order_id, _ := strconv.Atoi(orderId)

	fmt.Print("payload: ", notificationPayload)

	transaction, _ := h.TransactionRepository.GetTransaction(order_id)
	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			h.TransactionRepository.UpdateTransaction("pending", order_id)

			carts, err := h.CartRepository.FindCarts()
			if err != nil {
				return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
			}
			for _, cart := range carts {
				if cart.UserID == transaction.UserID {
					cartToDelete, err := h.CartRepository.GetCart(cart.ID)
					if err != nil {
						return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
					}
		
					_, err = h.CartRepository.DeleteCart(cartToDelete)
					if err != nil {
						return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
					}
				}
			}

		} else if fraudStatus == "accept" {
			SendMail("success", transaction)
			h.TransactionRepository.UpdateTransaction("success", order_id)
			
			carts, err := h.CartRepository.FindCarts()
			if err != nil {
				return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
			}
			for _, cart := range carts {
				if cart.UserID == transaction.UserID {
					cartToDelete, err := h.CartRepository.GetCart(cart.ID)
					if err != nil {
						return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
					}
		
					_, err = h.CartRepository.DeleteCart(cartToDelete)
					if err != nil {
						return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
					}
				}
			}
		}
	} else if transactionStatus == "settlement" {
		SendMail("success", transaction)
		h.TransactionRepository.UpdateTransaction("success", order_id)
		
		carts, err := h.CartRepository.FindCarts()
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
		}
		for _, cart := range carts {
			if cart.UserID == transaction.UserID {
				cartToDelete, err := h.CartRepository.GetCart(cart.ID)
				if err != nil {
					return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
				}
	
				_, err = h.CartRepository.DeleteCart(cartToDelete)
				if err != nil {
					return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
				}
			}
		}
	} else if transactionStatus == "deny" {
		h.TransactionRepository.UpdateTransaction("failed", order_id)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		h.TransactionRepository.UpdateTransaction("failed", order_id)
	} else if transactionStatus == "pending" {
		h.TransactionRepository.UpdateTransaction("pending", order_id)
		
		carts, err := h.CartRepository.FindCarts()
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
		}
		for _, cart := range carts {
			if cart.UserID == transaction.UserID {
				cartToDelete, err := h.CartRepository.GetCart(cart.ID)
				if err != nil {
					return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
				}
	
				_, err = h.CartRepository.DeleteCart(cartToDelete)
				if err != nil {
					return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
				}
			}
		}
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Data: notificationPayload})
}

func SendMail(status string, transaction models.Transaction) {

  if status != transaction.Status && (status == "success") {
    var CONFIG_SMTP_HOST = "smtp.gmail.com"
    var CONFIG_SMTP_PORT = 587
    var CONFIG_SENDER_NAME = "Waysbeans <waysbeans.admin@gmail.com>"
    var CONFIG_AUTH_EMAIL = os.Getenv("EMAIL_SYSTEM")
    var CONFIG_AUTH_PASSWORD = os.Getenv("PASSWORD_SYSTEM")

		var productsTransaction string
		for index, product := range transaction.ProductTransaction {
			productsTransaction += "(" + strconv.Itoa(index + 1) + ") " + product.ProductName + ", Rp" + strconv.Itoa(product.ProductPrice) + ", x" + strconv.Itoa(product.OrderQuantity) + "<br/>"
		}
    var totalQuantity = strconv.Itoa(transaction.TotalQuantity)
    var totalPrice = strconv.Itoa(transaction.TotalPrice)

    mailer := gomail.NewMessage()
    mailer.SetHeader("From", CONFIG_SENDER_NAME)
    mailer.SetHeader("To", "mfauzan.murtadho@gmail.com")
    mailer.SetHeader("Subject", "Transaction Status")
    mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
    <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      </head>
      <body>
      <h2>Product Payment</h2>
      <ul style="list-style-type:none;">
				<li>Name : %s</li>
				<li>Email : %s</li>
				<li>Phone : %s</li>
				<li>Address : %s</li>
				<br/>
				<li>Products :<br/> %s</li>
				<br/>
        <li>Total Quantity : %s</li>
        <li>Total Payment: Rp%s</li>
        <li>Status : <b>%s</b></li>
      </ul>
			<h4>&copy; 2023. <a href="https://waysbeans-coffee.vercel.app">WaysBeans</a>.</h4>
      </body>
    </html>`, transaction.Name, transaction.Email, transaction.Phone, transaction.Address, productsTransaction, totalQuantity, totalPrice, status))

    dialer := gomail.NewDialer(
      CONFIG_SMTP_HOST,
      CONFIG_SMTP_PORT,
      CONFIG_AUTH_EMAIL,
      CONFIG_AUTH_PASSWORD,
    )

    err := dialer.DialAndSend(mailer)
    if err != nil {
      log.Fatal(err.Error())
    }

    log.Println("Mail sent! to " + CONFIG_AUTH_EMAIL)
  }
}
