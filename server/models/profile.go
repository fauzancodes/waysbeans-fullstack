package models

import "time"

type WaysBeansProfile struct {
	ID        int                           `json:"id" gorm:"primary_key:auto_increment"`
	Photo     string                        `json:"photo" gorm:"type: varchar(255)"`
	Phone     string                        `json:"phone" gorm:"type: varchar(255)"`
	Address   string                        `json:"address" gorm:"type: text"`
	UserID    int                           `json:"user_id" gorm:"type: int"`
	User      WaysBeansUsersProfileResponse `json:"user"`
	CreatedAt time.Time                     `json:"-"`
	UpdatedAt time.Time                     `json:"-"`
}

type WaysBeansProfileResponse struct {
	Photo   string `json:"photo"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
	UserID  int    `json:"-"`
}

func (WaysBeansProfileResponse) TableName() string {
	return "ways_beans_profiles"
}
