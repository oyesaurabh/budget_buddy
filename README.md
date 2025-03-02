# 💰 Budget Buddy

Budget Buddy is a money management application designed to help users track their expenses and manage their finances efficiently. Users can add transaction details, visualize their spending data through graphs, and manage their account sessions securely.

## 💻 Screenshots

![1 ss](https://github.com/user-attachments/assets/06a980bd-982b-4488-bb33-6b8acd3a8dd5)
<br>

![2 ss](https://github.com/user-attachments/assets/c44be634-fd8c-45a9-8db6-3e0c19b81b30)
<br>

![3 ss](https://github.com/user-attachments/assets/aa28759a-fbd2-482d-bd45-a806e67e271d)
<br>

![4 ss](https://github.com/user-attachments/assets/a9b6bb8c-237d-4e9f-9466-3175cb155350)
<br>

![5 ss](https://github.com/user-attachments/assets/546b2eed-052e-46fc-96a8-17eb8ef6b8f4)
<br>

## 🚀 Features

- **Transaction Tracking**: Add and manage your transaction details, including expenses and income.
- **Data Visualization**: View your financial data in easy-to-understand graphs for better insights.
- **Secure User Sessions**: Ensure only one active session per user across devices using jose and Upstash Redis.
- **Responsive Design**: Seamless experience across all devices, powered by TailwindCSS and ShadCN.

## 🛠️ Tech Stack

- **Frontend**: Next.js - React-based framework for server-side rendering and static site generation.
- **Styling**: TailwindCSS and ShadCN - Utility-first styling framework and modern component library.
- **Database**: PostgreSQL - Relational database for storing user data and transactions.
- **ORM**: Prisma - Type-safe database interaction for seamless development.
- **Validation**: Zod - Schema-based validation for data integrity.
- **Authentication and Sessions**:
  - **JOSE** - JSON Object Signing and Encryption for session tokens.
  - **Upstash Redis** - Scalable Redis database for managing user sessions.

## 🏗️ Installation and Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/oyesaurabh/budget_buddy.git
   cd budget-buddy
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Environment Variables**: Create a `.env` file in the root directory and configure the following variables:

   ```bash
   NODE_ENV=""
   NEXT_API_BASE_URL=""

   # postgres config
   DATABASE_URL=""

   #jwt and salt
   SALT_SECRET_KEY=""
   JWT_SECRET=""

   #redis
   UPSTASH_REDIS_REST_URL=""
   UPSTASH_REDIS_REST_TOKEN=""
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

## 🔒 Security

- **One Active Session**: Sessions are managed with jose and stored in Upstash Redis, ensuring a user can only be logged in on one device at a time.
- **Data Validation**: All user inputs are validated using Zod to prevent malformed data entries.

## 📈 Future Enhancements

- Budgeting and saving goal features.
- Alert feature if we spend more than our goal
- Advanced data filters and more graph types.
- Integration with banking APIs for automatic transaction imports.

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or file an issue for feature requests or bugs.

---

Made with ❤️ by [Saurabh Yadav](https://github.com/oyesaurabh)
