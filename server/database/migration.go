package database

import (
	"fmt"
	"waysbeans/models"
	postgresql "waysbeans/pkg/postgresql"
)

func RunMigration() {
	err := postgresql.DB.AutoMigrate(
		&models.WaysBeansUser{},
		&models.WaysBeansProfile{},
		&models.WaysBeansProduct{},
		&models.WaysBeansCart{},
		&models.WaysBeansTransaction{},
		&models.WaysBeansProductTransaction{},
	)

	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("Migration Success")
}
