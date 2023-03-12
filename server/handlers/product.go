package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	productdto "waysbeans/dto/product"
	dto "waysbeans/dto/result"
	"waysbeans/models"
	"waysbeans/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerProduct struct {
	ProductRepository repositories.ProductRepository
}

func HandlerProduct(ProductRepository repositories.ProductRepository) *handlerProduct {
	return &handlerProduct{ProductRepository}
}

func (h *handlerProduct) FindProducts(c echo.Context) error {
	products, err := h.ProductRepository.FindProducts()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	if len(products) > 0 {
		return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Data for all products was successfully obtained", Data: convertResponseProducts(products)})
	} else {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: "No record found"})
	}
}

func (h *handlerProduct) GetProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var product models.Product
	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Product data successfully obtained", Data: convertResponseProduct(product)})
}

func (h *handlerProduct) CreateProduct(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userAdmin := userLogin.(jwt.MapClaims)["is_admin"].(bool)
	if userAdmin {
		dataFile := c.Get("dataFile").(string)
		fmt.Println("this is data file", dataFile)

		price, _ := strconv.Atoi(c.FormValue("price"))
		stock, _ := strconv.Atoi(c.FormValue("stock"))

		request := productdto.ProductRequest{
			Name:        c.FormValue("name"),
			Description: c.FormValue("description"),
			Price:       price,
			Photo:       dataFile,
			Stock:       stock,
		}

		validation := validator.New()
		err := validation.Struct(request)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
		}

		product := models.Product{
			Name:        request.Name,
			Description: request.Description,
			Price:       request.Price,
			Photo:       request.Photo,
			Stock:       request.Stock,
		}

		product, err = h.ProductRepository.CreateProduct(product)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
		}

		product, _ = h.ProductRepository.GetProduct(product.ID)

		return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Product data created successfully", Data: convertResponseProduct(product)})
	} else {
		return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Status: http.StatusUnauthorized, Message: "Sorry, you're not Admin"})
	}
}

func (h *handlerProduct) DeleteProduct(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userAdmin := userLogin.(jwt.MapClaims)["is_admin"].(bool)
	if userAdmin {
		id, _ := strconv.Atoi(c.Param("id"))

		product, err := h.ProductRepository.GetProduct(id)
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
		}

		data, err := h.ProductRepository.DeleteProduct(product)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
		}

		fileName := filepath.Base(product.Photo)
		dirPath := "uploads"

		filePath := fmt.Sprintf("%s/%s", dirPath, fileName)

		err = os.Remove(filePath)
		if err != nil {
			fmt.Println("Failed to delete file"+fileName+":", err)
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
		}

		fmt.Println("File " + fileName + " deleted successfully")

		return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Product data deleted successfully", Data: convertResponseProduct(data)})
	} else {
		return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Status: http.StatusUnauthorized, Message: "Sorry, you're not Admin"})
	}
}

func (h *handlerProduct) UpdateProduct(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userAdmin := userLogin.(jwt.MapClaims)["is_admin"].(bool)
	if userAdmin {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		dataFile := c.Get("dataFile").(string)
		fmt.Println("this is data file", dataFile)

		price, _ := strconv.Atoi(c.FormValue("price"))
		stock, _ := strconv.Atoi(c.FormValue("stock"))

		request := productdto.ProductRequest{
			Name:        c.FormValue("name"),
			Description: c.FormValue("description"),
			Price:       price,
			Photo:       dataFile,
			Stock:       stock,
		}

		validation := validator.New()
		err = validation.Struct(request)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
		}

		product, err := h.ProductRepository.GetProduct(int(id))
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
		}

		if request.Name != "" {
			product.Name = request.Name
		}
		if request.Description != "" {
			product.Description = request.Description
		}
		if request.Price != 0 {
			product.Price = request.Price
		}
		if request.Photo != "" {
			fileName := filepath.Base(product.Photo)
			dirPath := "uploads"

			filePath := fmt.Sprintf("%s/%s", dirPath, fileName)

			err = os.Remove(filePath)
			if err != nil {
				fmt.Println("Failed to delete file"+fileName+":", err)
				return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
			}

			fmt.Println("File " + fileName + " deleted successfully")

			product.Photo = request.Photo
		}
		if request.Stock != 0 {
			product.Stock = request.Stock
		}

		data, err := h.ProductRepository.UpdateProduct(product)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
		}

		return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Product data updated successfully", Data: convertResponseProduct(data)})
	} else {
		return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Status: http.StatusUnauthorized, Message: "Sorry, you're not Admin"})
	}
}

func (h *handlerProduct) IncreaseStock(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var product models.Product
	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	product.Stock += 1

	newProduct, err := h.ProductRepository.UpdateProduct(product)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Product stock successfully increased", Data: convertResponseProduct(newProduct)})
}

func (h *handlerProduct) DecreaseStock(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var product models.Product
	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	product.Stock -= 1

	newProduct, err := h.ProductRepository.UpdateProduct(product)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Product stock successfully decreased", Data: convertResponseProduct(newProduct)})
}

func convertResponseProduct(u models.Product) productdto.ProductResponse {
	return productdto.ProductResponse{
		ID:          u.ID,
		Name:        u.Name,
		Description: u.Description,
		Price:       u.Price,
		Photo:       u.Photo,
		Stock:       u.Stock,
	}
}

func convertResponseProducts(products []models.Product) []productdto.ProductResponse {
	var responseProducts []productdto.ProductResponse

	for _, product := range products {
		responseProducts = append(responseProducts, convertResponseProduct(product))
	}

	return responseProducts
}
