package models

import "time"

type WaysBeansUser struct {
	ID          int                                `json:"id" gorm:"primary_key:auto_increment"`
	IsAdmin     bool                               `json:"is_admin" gorm:"type: bool"`
	Name        string                             `json:"name" gorm:"type: varchar(255)"`
	Email       string                             `json:"email" gorm:"type: varchar(255)"`
	Password    string                             `json:"-" gorm:"type: varchar(255)"`
	Profile     WaysBeansProfileResponse           `json:"profile" gorm:"foreignkey:UserID"`
	Cart        []WaysBeansCartUSerResponse        `json:"cart" gorm:"foreignkey:UserID"`
	Transaction []WaysBeansTransactionUSerResponse `json:"transaction" gorm:"foreignkey:UserID"`
	CreatedAt   time.Time                          `json:"-"`
	UpdatedAt   time.Time                          `json:"-"`
}

type WaysBeansUsersProfileResponse struct {
	ID      int    `json:"id"`
	UserID  int    `json:"user_id" gorm:"-"`
	IsAdmin bool   `json:"is_admin"`
	Name    string `json:"name"`
}

type WaysBeansUsersCartResponse struct {
	ID      int    `json:"id"`
	IsAdmin bool   `json:"is_admin"`
	Name    string `json:"name"`
}

type WaysBeansUserTransactionResponse struct {
	ID    int    `json:"id" gorm:"primary_key:auto_increment"`
	Name  string `json:"name" gorm:"type: varchar(255)"`
	Email string `json:"email" gorm:"type: varchar(255)"`
}

func (WaysBeansUsersProfileResponse) TableName() string {
	return "ways_beans_users"
}

func (WaysBeansUsersCartResponse) TableName() string {
	return "ways_beans_users"
}

func (WaysBeansUserTransactionResponse) TableName() string {
	return "ways_beans_users"
}
