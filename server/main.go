package main //for local
// package handler //for vercel

import (
	"fmt"
	"net/http"
	"os"
	"waysbeans/database"
	"waysbeans/pkg/postgresql"
	"waysbeans/routes"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := Start()

	var port = os.Getenv("PORT")

	fmt.Println("server running localhost:" + port)
	e.Logger.Fatal(e.Start(":" + port))
}

func Main(w http.ResponseWriter, r *http.Request) {
	e := Start()

	e.ServeHTTP(w, r)
}

func Start() *echo.Echo {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PATCH, echo.DELETE},
		AllowHeaders: []string{"X-Requested-With", "Content-Type", "Authorization"},
	}))

	postgresql.DatabaseInit()
	database.RunMigration()

	routes.RouteInit(e.Group("/api/v1"))

	e.Static("/uploads", "./uploads")

	return e
}
