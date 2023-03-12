package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	profiledto "waysbeans/dto/profile"
	dto "waysbeans/dto/result"
	"waysbeans/models"
	"waysbeans/repositories"

	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerProfile struct {
	ProfileRepository repositories.ProfileRepository
}

func HandlerProfile(ProfileRepository repositories.ProfileRepository) *handlerProfile {
	return &handlerProfile{ProfileRepository}
}

func (h *handlerProfile) FindProfiles(c echo.Context) error {
	profiles, err := h.ProfileRepository.FindProfiles()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	if len(profiles) > 0 {
		return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Data for all profiles was successfully obtained", Data: profiles})
	} else {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: "No record found"})
	}
}

func (h *handlerProfile) GetProfile(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var profile models.Profile
	profile, err := h.ProfileRepository.GetProfile(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Profile data successfully obtained", Data: convertResponseProfile(profile)})
}

func (h *handlerProfile) CreateProfile(c echo.Context) error {
	dataFile := c.Get("dataFile").(string)
	fmt.Println("this is data file", dataFile)

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	request := profiledto.ProfileRequest{
		ID:      int(userId),
		Photo:   dataFile,
		Phone:   c.FormValue("phone"),
		Address: c.FormValue("address"),
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	profile := models.Profile{
		ID:      request.ID,
		Photo:   request.Photo,
		Phone:   request.Phone,
		Address: request.Address,
		UserID:  int(userId),
	}

	profile, err = h.ProfileRepository.CreateProfile(profile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	profile, _ = h.ProfileRepository.GetProfile(profile.ID)

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Profile data created successfully", Data: convertResponseProfile(profile)})
}

func (h *handlerProfile) UpdateProfile(c echo.Context) error {
	dataFile := c.Get("dataFile").(string)
	fmt.Println("this is data file", dataFile)
	id, _ := strconv.Atoi(c.Param("id"))

	request := profiledto.ProfileRequest{
		ID:      id,
		Photo:   dataFile,
		Phone:   c.FormValue("phone"),
		Address: c.FormValue("address"),
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	user, err := h.ProfileRepository.GetProfile(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	user.ID = request.ID

	if request.Photo != "" {
		if user.Photo != "" {
			fileName := filepath.Base(user.Photo)
			dirPath := "uploads"

			filePath := fmt.Sprintf("%s/%s", dirPath, fileName)

			err = os.Remove(filePath)
			if err != nil {
				fmt.Println("Failed to delete file"+fileName+":", err)
				return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
			}

			fmt.Println("File " + fileName + " deleted successfully")
		}

		user.Photo = request.Photo
	}
	if request.Phone != "" {
		user.Phone = request.Phone
	}
	if request.Address != "" {
		user.Address = request.Address
	}

	data, err := h.ProfileRepository.UpdateProfile(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Profile data updated successfully", Data: convertResponseProfile(data)})
}

func (h *handlerProfile) DeleteProfile(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	user, err := h.ProfileRepository.GetProfile(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	fileName := user.Photo
	dirPath := "uploads"

	filePath := fmt.Sprintf("%s/%s", dirPath, fileName)

	data, err := h.ProfileRepository.DeleteProfile(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	err = os.Remove(filePath)
	if err != nil {
		fmt.Println("Failed to delete file"+fileName+":", err)
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	fmt.Println("File " + fileName + " deleted successfully")

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Profile data deleted successfully", Data: convertResponseProfile(data)})
}

func convertResponseProfile(u models.Profile) profiledto.ProfileResponse {
	return profiledto.ProfileResponse{
		ID:      u.ID,
		Photo:   u.Photo,
		Phone:   u.Phone,
		Address: u.Address,
		UserID:  u.UserID,
		User:    u.User,
	}
}
