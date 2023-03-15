package middleware

import (
	"io"
	"io/ioutil"
	"net/http"
	"path/filepath"

	"github.com/labstack/echo/v4"
)

func UploadFile(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		file, err := c.FormFile("photo")
		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}
		if file != nil {
			ext := filepath.Ext(file.Filename)
			if ext == ".png" || ext == ".jpg" || ext == ".jpeg" || ext == ".webp" {
				src, err := file.Open()
				if err != nil {
					return c.JSON(http.StatusBadRequest, err)
				}
				defer src.Close()

				tempFile, err := ioutil.TempFile("uploads", "image-*.png")
				if err != nil {
					return c.JSON(http.StatusBadRequest, err)
				}
				defer tempFile.Close()

				if _, err = io.Copy(tempFile, src); err != nil {
					return c.JSON(http.StatusBadRequest, err)
				}

				data := tempFile.Name()

				c.Set("dataFile", data)
				return next(c)
			} else {
				return c.JSON(http.StatusBadRequest, "The file extension is wrong. Allowed file extensions are images (.png, .jpg, .jpeg, .webp)")
			}
		}

		c.Set("dataFile", "")
		return next(c)
	}
}
