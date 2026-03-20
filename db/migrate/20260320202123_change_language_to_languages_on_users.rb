class ChangeLanguageToLanguagesOnUsers < ActiveRecord::Migration[7.1]
  def up
    add_column :users, :languages, :text, array: true, default: []
    execute <<~SQL
      UPDATE users SET languages = ARRAY[language] WHERE language IS NOT NULL AND language != '';
    SQL
    remove_column :users, :language
  end

  def down
    add_column :users, :language, :string
    execute <<~SQL
      UPDATE users SET language = languages[1] WHERE array_length(languages, 1) > 0;
    SQL
    remove_column :users, :languages
  end
end
