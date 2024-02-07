package models

import "time"

type WaysBeansUser struct {
	ID          int                                `json:"id" gorm:"primary_key:auto_increment"`
	IsAdmin     bool                               `json:"is_admin" gorm:"type: bool"`
	Name        string                             `json:"name" gorm:"type: varchar(255)"`
	Email       string                             `json:"email" gorm:"type: varchar(255)"`
	Password    string                             `json:"-" gorm:"type: varchar(255)"`
	Profile     WaysBeansProfileResponse           `json:"profile"`
	Cart        []WaysBeansCartUSerResponse        `json:"cart"`
	Transaction []WaysBeansTransactionUSerResponse `json:"transaction"`
	CreatedAt   time.Time                          `json:"-"`
	UpdatedAt   time.Time                          `json:"-"`
}

type WaysBeansUsersProfileResponse struct {
	ID      int    `json:"id"`
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
