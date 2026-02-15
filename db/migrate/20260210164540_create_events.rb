class CreateEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :events do |t|
      t.references :city, null: false, foreign_key: true
      t.references :host, null: false, foreign_key: { to_table: :users }
      t.string :title
      t.text :description
      t.string :address
      t.string :status
      t.integer :capacity
      t.datetime :starts_at
      t.datetime :ends_at

      t.timestamps
    end
  end
end
