package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	dto "waysbeans/dto/result"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/labstack/echo/v4"
)

func UploadFile(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		var method = c.Request().Method
		file, err := c.FormFile("photo")

		if err != nil {
			if method == "PATCH" && err.Error() == "http: no such file" {
				// c.Set("dataFile", "")
				c.Set("cloudinarySecureURL", "")
				return next(c)
			}
		}
		if err != nil {
			if method == "POST" && err.Error() == "http: no such file" {
				// c.Set("dataFile", "")
				c.Set("cloudinarySecureURL", "")
				return next(c)
			}
		}

		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}
		ext := filepath.Ext(file.Filename)
		if ext == ".png" || ext == ".jpg" || ext == ".jpeg" || ext == ".webp" {
			src, err := file.Open()
			if err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}
			defer src.Close()

			// tempFile, err := ioutil.TempFile("uploads", "image-*.png")
			// if err != nil {
			// 	return c.JSON(http.StatusBadRequest, err)
			// }
			// defer tempFile.Close()

			// if _, err = io.Copy(tempFile, src); err != nil {
			// 	return c.JSON(http.StatusBadRequest, err)
			// }

			// data := tempFile.Name()

			var ctx = context.Background()
			cld, _ := cloudinary.NewFromParams(os.Getenv("CLOUD_NAME"), os.Getenv("API_KEY"), os.Getenv("API_SECRET"))
			resp, err := cld.Upload.Upload(ctx, src, uploader.UploadParams{Folder: "waysbeans"})
			if err != nil {
				fmt.Println(err.Error())
			}
			// fmt.Println("resp.SecureURL:", resp.SecureURL)

			if resp.SecureURL == "" {
				return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: resp.Error.Message})
			}

			// c.Set("dataFile", data)
			c.Set("cloudinarySecureURL", resp.SecureURL)
			return next(c)
		} else {
			return c.JSON(http.StatusBadRequest, "The file extension is wrong. Allowed file extensions are images (.png, .jpg, .jpeg, .webp)")
		}
	}
}
