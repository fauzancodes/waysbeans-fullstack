package handlers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	dto "waysbeans/dto/result"
	usersdto "waysbeans/dto/user"
	"waysbeans/models"
	"waysbeans/repositories"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handler struct {
	UserRepository        repositories.UserRepository
	ProfileRepository     repositories.ProfileRepository
	CartRepository        repositories.CartRepository
	TransactionRepository repositories.TransactionRepository
}

func HandlerUser(UserRepository repositories.UserRepository, ProfileRepository repositories.ProfileRepository, CartRepository repositories.CartRepository, TransactionRepository repositories.TransactionRepository) *handler {
	return &handler{
		UserRepository:        UserRepository,
		ProfileRepository:     ProfileRepository,
		CartRepository:        CartRepository,
		TransactionRepository: TransactionRepository,
	}
}

func (h *handler) FindUsers(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userAdmin := userLogin.(jwt.MapClaims)["is_admin"].(bool)
	if userAdmin {
		users, err := h.UserRepository.FindUsers()
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
		}

		if len(users) > 0 {
			return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Data for all users was successfully obtained", Data: users})
		} else {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: "No record found"})
		}
	} else {
		return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Status: http.StatusUnauthorized, Message: "Sorry, you're not Admin"})
	}
}

func (h *handler) GetUser(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	user, err := h.UserRepository.GetUser(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "User data successfully obtained", Data: user})
}

func (h *handler) UpdateUser(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	request := new(usersdto.UpdateUserRequest)
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	user, err := h.UserRepository.GetUser(int(userId))

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	user.IsAdmin = request.IsAdmin

	if request.Name != "" {
		user.Name = request.Name
	}

	if request.Email != "" {
		user.Email = request.Email
	}

	if request.Password != "" {
		user.Password = request.Password
	}

	data, err := h.UserRepository.UpdateUser(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "User data updated successfully", Data: convertResponse(data)})
}

func (h *handler) DeleteUser(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	profiles, err := h.ProfileRepository.FindProfiles()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}
	for _, profile := range profiles {
		if profile.UserID == int(userId) {
			userProfile, err := h.ProfileRepository.GetProfile(profile.ID)
			if err != nil {
				return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
			}
			fileName := userProfile.Photo
			dirPath := "uploads"

			filePath := fmt.Sprintf("%s/%s", dirPath, fileName)

			_, err = h.ProfileRepository.DeleteProfile(userProfile)
			if err != nil {
				return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
			}

			err = os.Remove(filePath)
			if err != nil {
				fmt.Println("Failed to delete file"+fileName+":", err)
				return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
			}

			fmt.Println("File " + fileName + " deleted successfully")
		}
	}

	carts, err := h.CartRepository.FindCarts()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}
	for _, cart := range carts {
		if cart.UserID == int(userId) {
			userCart, err := h.CartRepository.GetCart(cart.ID)
			if err != nil {
				return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
			}
			_, err = h.CartRepository.DeleteCart(userCart)
			if err != nil {
				return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
			}
		}
	}

	transactions, err := h.TransactionRepository.FindTransactions()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}
	for _, transaction := range transactions {
		if transaction.UserID == int(userId) {
			userTransaction, err := h.TransactionRepository.GetTransaction(transaction.ID)
			if err != nil {
				return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
			}
			_, err = h.TransactionRepository.DeleteTransaction(userTransaction)
			if err != nil {
				return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
			}
		}
	}

	user, err := h.UserRepository.GetUser(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.UserRepository.DeleteUser(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "User data deleted successfully", Data: convertResponse(data)})
}

func convertResponse(u models.User) usersdto.UserResponse {
	return usersdto.UserResponse{
		ID:    u.ID,
		Name:  u.Name,
		Email: u.Email,
	}
}
