package models

import "time"

type Profile struct {
	ID        int                  `json:"id" gorm:"primary_key:auto_increment"`
	Photo     string               `json:"photo" gorm:"type: varchar(255)"`
	Phone     string               `json:"phone" gorm:"type: varchar(255)"`
	Address   string               `json:"address" gorm:"type: text"`
	UserID    int                  `json:"user_id" gorm:"type: int"`
	User      UsersProfileResponse `json:"user"`
	CreatedAt time.Time            `json:"-"`
	UpdatedAt time.Time            `json:"-"`
}

type ProfileResponse struct {
	Photo   string `json:"photo"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
	UserID  int    `json:"-"`
}

func (ProfileResponse) TableName() string {
	return "profiles"
}
