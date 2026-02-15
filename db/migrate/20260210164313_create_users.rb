class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :name
      t.text :bio
      t.string :avatar_url
      t.string :language
      t.date :birthday
      t.references :city, null: false, foreign_key: true

      t.timestamps
    end
  end
end
