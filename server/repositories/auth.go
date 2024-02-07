package repositories

import (
	"waysbeans/models"

	"gorm.io/gorm"
)

type AuthRepository interface {
	Register(user models.WaysBeansUser) (models.WaysBeansUser, error)
	Login(email string) (models.WaysBeansUser, error)
	CheckAuth(ID int) (models.WaysBeansUser, error)
}

func RepositoryAuth(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) Register(user models.WaysBeansUser) (models.WaysBeansUser, error) {
	err := r.db.Create(&user).Error

	return user, err
}

func (r *repository) Login(email string) (models.WaysBeansUser, error) {
	var user models.WaysBeansUser
	err := r.db.First(&user, "email=?", email).Error

	return user, err
}

func (r *repository) CheckAuth(ID int) (models.WaysBeansUser, error) {
	var user models.WaysBeansUser
	err := r.db.Preload("Profile").Preload("Cart").Preload("Transaction").First(&user, ID).Error

	return user, err
}
