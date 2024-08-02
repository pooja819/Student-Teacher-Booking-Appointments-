// Initialize local storage data
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}
if (!localStorage.getItem('appointments')) {
    localStorage.setItem('appointments', JSON.stringify([]));
}

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    const users = JSON.parse(localStorage.getItem('users'));
    users.push({ email, password, role });
    localStorage.setItem('users', JSON.stringify(users));

    alert('User registered successfully');
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        if (user.role === 'teacher') {
            document.getElementById('teacher-section').style.display = 'block';
            loadTeacherAppointments();
        } else {
            document.getElementById('student-section').style.display = 'block';
            loadStudentAppointments();
        }
    } else {
        alert('Invalid email or password');
    }
});

document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('app-section').style.display = 'none';
    document.getElementById('teacher-section').style.display = 'none';
    document.getElementById('student-section').style.display = 'none';
});

document.getElementById('schedule-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    appointments.push({ teacher: currentUser.email, date, time, student: null });
    localStorage.setItem('appointments', JSON.stringify(appointments));

    loadTeacherAppointments();
});

document.getElementById('book-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const teacher = document.getElementById('book-teacher').value;
    const date = document.getElementById('book-date').value;
    const time = document.getElementById('book-time').value;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const appointment = appointments.find(app => app.teacher === teacher && app.date === date && app.time === time);

    if (appointment && !appointment.student) {
        appointment.student = currentUser.email;
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadStudentAppointments();
    } else {
        alert('No available appointment found for the selected teacher and time');
    }
});

function loadTeacherAppointments() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const teacherAppointments = appointments.filter(app => app.teacher === currentUser.email);

    const teacherAppointmentsDiv = document.getElementById('teacher-appointments');
    teacherAppointmentsDiv.innerHTML = '<h3>Your Appointments</h3>';
    teacherAppointments.forEach(app => {
        const studentInfo = app.student ? ` - Booked by ${app.student}` : ' - Available';
        teacherAppointmentsDiv.innerHTML += `<p>${app.date} ${app.time}${studentInfo}</p>`;
    });
}

function loadStudentAppointments() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const studentAppointments = appointments.filter(app => app.student === currentUser.email);

    const studentAppointmentsDiv = document.getElementById('student-appointments');
    studentAppointmentsDiv.innerHTML = '<h3>Your Appointments</h3>';
    studentAppointments.forEach(app => {
        studentAppointmentsDiv.innerHTML += `<p>${app.date} ${app.time} with ${app.teacher}</p>`;
    });
}