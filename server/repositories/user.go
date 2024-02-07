package repositories

import (
	"waysbeans/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	FindUsers() ([]models.WaysBeansUser, error)
	GetUser(ID int) (models.WaysBeansUser, error)
	CreateUser(user models.WaysBeansUser) (models.WaysBeansUser, error)
	UpdateUser(user models.WaysBeansUser) (models.WaysBeansUser, error)
	DeleteUser(user models.WaysBeansUser) (models.WaysBeansUser, error)
}

func RepositoryUser(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindUsers() ([]models.WaysBeansUser, error) {
	var users []models.WaysBeansUser
	err := r.db.Preload("Profile").Preload("Cart").Preload("Transaction").Find(&users).Error

	return users, err
}

func (r *repository) GetUser(ID int) (models.WaysBeansUser, error) {
	var user models.WaysBeansUser
	err := r.db.Preload("Profile").Preload("Cart").Preload("Transaction").First(&user, ID).Error

	return user, err
}

func (r *repository) CreateUser(user models.WaysBeansUser) (models.WaysBeansUser, error) {
	err := r.db.Create(&user).Error

	return user, err
}

func (r *repository) UpdateUser(user models.WaysBeansUser) (models.WaysBeansUser, error) {
	err := r.db.Save(&user).Error

	return user, err
}

func (r *repository) DeleteUser(user models.WaysBeansUser) (models.WaysBeansUser, error) {
	err := r.db.Delete(&user).Scan(&user).Error

	return user, err
}
