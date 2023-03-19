package routes

import (
	"waysbeans/handlers"
	"waysbeans/pkg/middleware"
	"waysbeans/pkg/mysql"
	"waysbeans/repositories"

	"github.com/labstack/echo/v4"
)

func CartRoutes(e *echo.Group) {
	cartRepository := repositories.RepositoryCart(mysql.DB)
	h := handlers.HandlerCart(cartRepository)

	e.GET("/carts", h.FindCarts)
	e.GET("/cart/:id", middleware.Auth(h.GetCart))
	e.POST("/cart/:product_id", middleware.Auth(h.CreateCart))
	e.DELETE("/cart/:product_id", middleware.Auth(h.DeleteCart))
	e.PATCH("/increase-order-quantity/:product_id", middleware.Auth(h.IncreaseOrderQauntity))
	e.PATCH("/decrease-order-quantity/:product_id", middleware.Auth(h.DecreaseOrderQauntity))
}
