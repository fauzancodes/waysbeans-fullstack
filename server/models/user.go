package models

import "time"

type User struct {
	ID          int                       `json:"id" gorm:"primary_key:auto_increment"`
	IsAdmin     bool                      `json:"is_admin" gorm:"type: bool"`
	Name        string                    `json:"name" gorm:"type: varchar(255)"`
	Email       string                    `json:"email" gorm:"type: varchar(255)"`
	Password    string                    `json:"-" gorm:"type: varchar(255)"`
	Profile     ProfileResponse           `json:"profile"`
	Cart        []CartUSerResponse        `json:"cart"`
	Transaction []TransactionUSerResponse `json:"transaction"`
	CreatedAt   time.Time                 `json:"-"`
	UpdatedAt   time.Time                 `json:"-"`
}

type UsersProfileResponse struct {
	ID      int    `json:"id"`
	IsAdmin bool   `json:"is_admin"`
	Name    string `json:"name"`
}

type UsersCartResponse struct {
	ID      int    `json:"id"`
	IsAdmin bool   `json:"is_admin"`
	Name    string `json:"name"`
}

type UserTransactionResponse struct {
	ID    int    `json:"id" gorm:"primary_key:auto_increment"`
	Name  string `json:"name" gorm:"type: varchar(255)"`
	Email string `json:"email" gorm:"type: varchar(255)"`
}

func (UsersProfileResponse) TableName() string {
	return "users"
}

func (UsersCartResponse) TableName() string {
	return "users"
}

func (UserTransactionResponse) TableName() string {
	return "users"
}
