class CreateEventInterests < ActiveRecord::Migration[7.1]
  def change
    create_table :event_interests do |t|
      t.references :event, null: false, foreign_key: true
      t.references :interest, null: false, foreign_key: true

      t.timestamps
    end
  end
end
