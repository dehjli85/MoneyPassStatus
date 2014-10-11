# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140903184052) do

  create_table "atm_statuses", force: true do |t|
    t.integer  "money_order_status_id"
    t.string   "money_order_status_description"
    t.integer  "bluebird_status_id"
    t.string   "bluebird_status_description"
    t.datetime "status_check_date"
    t.integer  "atm_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "atms", force: true do |t|
    t.string   "name"
    t.string   "street"
    t.string   "city"
    t.string   "state"
    t.string   "postalCode"
    t.boolean  "isAvailable24Hours"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
