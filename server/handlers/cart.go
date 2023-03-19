package handlers

import (
	"net/http"
	"strconv"
	cartsdto "waysbeans/dto/cart"
	dto "waysbeans/dto/result"
	"waysbeans/models"
	"waysbeans/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerCart struct {
	CartRepository repositories.CartRepository
}

func HandlerCart(CartRepository repositories.CartRepository) *handlerCart {
	return &handlerCart{
		CartRepository: CartRepository,
	}
}

func (h *handlerCart) FindCarts(c echo.Context) error {
	carts, err := h.CartRepository.FindCarts()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	if len(carts) > 0 {
		return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Data for all carts was successfully obtained", Data: carts})
	} else {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: "No record found"})
	}
}

func (h *handlerCart) GetCart(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	cart, err := h.CartRepository.GetCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Cart data successfully obtained", Data: cart})
}

func (h *handlerCart) CreateCart(c echo.Context) error {
	request := new(cartsdto.CartRequest)
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
	productId, _ := strconv.Atoi(c.Param("product_id"))

	cart := models.Cart{
		ProductID:     productId,
		OrderQuantity: request.OrderQuantity,
		UserID:        int(userId),
	}

	data, err := h.CartRepository.CreateCart(cart)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Cart data created successfully", Data: convertResponseCart(data)})
}

func (h *handlerCart) DeleteCart(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	productId, _ := strconv.Atoi(c.Param("product_id"))
	
	carts, err := h.CartRepository.FindCarts()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	var dataDeleted models.Cart
	for _, cart := range carts {
		if cart.UserID == int(userId) && cart.ProductID == productId {
			data, err := h.CartRepository.DeleteCart(cart)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
			}
			dataDeleted = data
		}
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Cart data deleted successfully", Data: convertResponseCart(dataDeleted)})
}

func (h *handlerCart) IncreaseOrderQauntity(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	productId, _ := strconv.Atoi(c.Param("product_id"))

	carts, err := h.CartRepository.FindCarts()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	var cartNew models.Cart
	for _, cart := range carts {
		if cart.UserID == int(userId) && cart.ProductID == productId {
			cart.OrderQuantity += 1
			cartNew = cart
		}
	}

	newCart, err := h.CartRepository.UpdateCart(cartNew)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Cart order quantity successfully increased", Data: convertResponseCart(newCart)})
}

func (h *handlerCart) DecreaseOrderQauntity(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	productId, _ := strconv.Atoi(c.Param("product_id"))

	carts, err := h.CartRepository.FindCarts()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	var cartNew models.Cart
	for _, cart := range carts {
		if cart.UserID == int(userId) && cart.ProductID == productId {
			cart.OrderQuantity -= 1
			cartNew = cart
		}
	}

	newCart, err := h.CartRepository.UpdateCart(cartNew)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Cart order quantity successfully increased", Data: convertResponseCart(newCart)})
}

func convertResponseCart(u models.Cart) cartsdto.CartResponse {
	return cartsdto.CartResponse{
		ID:            u.ID,
		ProductID:     u.ProductID,
		OrderQuantity: u.OrderQuantity,
		UserID:        u.UserID,
	}
}
