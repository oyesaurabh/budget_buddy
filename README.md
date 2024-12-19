# 💰 Budget Buddy

Budget Buddy is a money management application designed to help users track their expenses and manage their finances efficiently. Users can add transaction details, visualize their spending data through graphs, and manage their account sessions securely.

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
   git clone https://github.com/your-username/budget-buddy.git
   cd budget-buddy
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Environment Variables**: Create a `.env` file in the root directory and configure the following variables:
   ```bash
   DATABASE_URL=your_database_url
   NEXT_PUBLIC_API_URL=your_api_url
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
- Advanced data filters and more graph types.
- Integration with banking APIs for automatic transaction imports.

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or file an issue for feature requests or bugs.

---

Made with ❤️ by [Saurabh Yadav](https://github.com/oyesaurabh)
