package repositories

import (
	"waysbeans/models"

	"gorm.io/gorm"
)

type ProfileRepository interface {
	FindProfiles() ([]models.WaysBeansProfile, error)
	GetProfile(ID int) (models.WaysBeansProfile, error)
	CreateProfile(profile models.WaysBeansProfile) (models.WaysBeansProfile, error)
	UpdateProfile(profile models.WaysBeansProfile) (models.WaysBeansProfile, error)
	DeleteProfile(profile models.WaysBeansProfile) (models.WaysBeansProfile, error)
}

func RepositoryProfile(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindProfiles() ([]models.WaysBeansProfile, error) {
	var profiles []models.WaysBeansProfile
	err := r.db.Preload("User").Find(&profiles).Error

	return profiles, err
}

func (r *repository) GetProfile(ID int) (models.WaysBeansProfile, error) {
	var profile models.WaysBeansProfile
	err := r.db.Preload("User").First(&profile, ID).Error

	return profile, err
}

func (r *repository) CreateProfile(profile models.WaysBeansProfile) (models.WaysBeansProfile, error) {
	err := r.db.Create(&profile).Error

	return profile, err
}

func (r *repository) UpdateProfile(profile models.WaysBeansProfile) (models.WaysBeansProfile, error) {
	err := r.db.Save(&profile).Error

	return profile, err
}

func (r *repository) DeleteProfile(profile models.WaysBeansProfile) (models.WaysBeansProfile, error) {
	err := r.db.Delete(&profile).Scan(&profile).Error

	return profile, err
}
