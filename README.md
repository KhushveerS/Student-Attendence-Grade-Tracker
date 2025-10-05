# Student Grade & Attendance Tracker

A comprehensive web application for tracking student grades, attendance, and performance analytics. Built with React, TypeScript, and Tailwind CSS, this application provides educators with tools to manage student data, analyze performance trends, and generate reports.

## Features

- **Student Management**: Add, edit, and delete student records with details like name, roll number, class, email, and parent contact
- **Subject Tracking**: Record and manage subject-wise marks for each student with automatic grade calculation
- **Attendance System**: Track daily attendance with status options (present, absent, late, excused)
- **Performance Analytics**: Visualize class performance with charts and statistics
- **Leaderboard**: Rank students based on their academic performance
- **Remarks Section**: Add positive, negative, or neutral remarks for each student
- **Data Export**: Export student data and reports in CSV and text formats
- **Bulk Import**: Import student data from CSV files
- **Local Storage**: All data is persisted in the browser's local storage

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Persistence**: Browser Local Storage

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/student-grade-attendance-tracker.git
   ```

2. Navigate to the project directory:
   ```bash
   cd student-grade-attendance-tracker
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and visit `http://localhost:5173` (default Vite port)

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the production-ready application
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint for code quality checks
- `npm run typecheck` - Checks TypeScript types

## Usage

### Managing Students

1. **Add a Student**: Click the "Add Student" button and fill in the required details
2. **Edit a Student**: Click the edit icon on any student card to modify their information
3. **Delete a Student**: Click the delete icon on any student card (requires confirmation)

### Tracking Subjects and Grades

1. **Add Subjects**: Click on a student card and then "Add Subject" to add subject marks
2. **Edit Subjects**: In the student details view, click the edit icon next to any subject
3. **Delete Subjects**: In the student details view, click the delete icon next to any subject

### Attendance Tracking

1. In the student details view, use the attendance buttons to mark daily attendance
2. View attendance history in the student details section

### Analytics and Reports

1. **Class Analytics**: Click the "Analytics" tab to view class performance statistics
2. **Leaderboard**: Click the "Leaderboard" tab to see student rankings
3. **Export Data**: Use the "Export CSV" button to export all student data
4. **Individual Reports**: In the student details view, click "Export Report" to generate a detailed performance report

### Bulk Import

1. Click the "Import" button
2. Download the CSV template if needed
3. Upload your student data CSV file
4. Review import results and handle any errors

## Data Structure

### Student
- `id`: Unique identifier
- `name`: Student's full name
- `rollNumber`: Unique roll number
- `class`: Class/grade
- `email`: (Optional) Student's email
- `parentContact`: (Optional) Parent's contact information
- `subjects`: Array of subject records
- `attendance`: Array of attendance records
- `remarks`: Array of remarks
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Subject
- `id`: Unique identifier
- `subjectName`: Name of the subject
- `marks`: Marks obtained
- `maxMarks`: Maximum possible marks
- `grade`: Letter grade (automatically calculated)

### Attendance Record
- `date`: Date of attendance
- `status`: One of 'present', 'absent', 'late', 'excused'

### Remark
- `id`: Unique identifier
- `text`: Remark content
- `date`: Date of remark
- `type`: One of 'positive', 'negative', 'neutral'

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Commit your changes
4. Push to your branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons provided by [Lucide React](https://lucide.dev/)
- Data visualization using built-in React components