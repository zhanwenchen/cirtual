#Cirtual Coding Challenge

### Zhanwen "Phil" Chen

### Steps for local deployment

  1. Create a MySQL database called 'database_development' (drop if exist)

  ```
  $ mysql
  ```

  ```
  mysql> drop if exists database database_development;
  ```


  ```
  mysql> create database database_development;
  ```

  ```
  mysql> \q
  ```

  2. Install Node modules

  ```
  $ npm install
  ```


  3. Start the application

  ```
  $ npm start
  ```

  4. View in browser by default : http://localhost:3000/


## Notes

Sessions don't persist, so login is required once you navigate away.
