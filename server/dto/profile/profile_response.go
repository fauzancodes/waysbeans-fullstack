package profiledto

import "waysbeans/models"

type ProfileResponse struct {
	ID      int                         `json:"id" gorm:"primary_key:auto_increment"`
	Photo   string                      `json:"photo" gorm:"type: varchar(255)"`
	Phone   string                      `json:"phone" gorm:"type: varchar(255)"`
	Address string                      `json:"address" gorm:"type: text"`
	UserID  int                         `json:"user_id"`
	User    models.UsersProfileResponse `json:"user"`
}
