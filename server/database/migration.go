package database

import (
	"fmt"
	"waysbeans/models"
	"waysbeans/pkg/mysql"
)

func RunMigration() {
	err := mysql.DB.AutoMigrate(
		&models.WaysBeansUser{},
		&models.WaysBeansProfile{},
		&models.WaysBeansProduct{},
		&models.WaysBeansCart{},
		&models.WaysBeansTransaction{},
		&models.WaysBeansProductTransaction{},
	)

	if err != nil {
		fmt.Println(err)
		panic("Migration Failed")
	}

	fmt.Println("Migration Success")
}
