from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///placement_portal.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'company', 'student'
    is_approved = db.Column(db.Boolean, default=True)
    is_active = db.Column(db.Boolean, default=True)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15))
    roll_number = db.Column(db.String(20), unique=True)
    department = db.Column(db.String(50))
    cgpa = db.Column(db.Float)
    resume_path = db.Column(db.String(200))

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    hr_contact = db.Column(db.String(100))
    website = db.Column(db.String(100))
    description = db.Column(db.Text)

class PlacementDrive(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    job_title = db.Column(db.String(100), nullable=False)
    job_description = db.Column(db.Text)
    eligibility_criteria = db.Column(db.Text)
    application_deadline = db.Column(db.Date)
    status = db.Column(db.String(20), default='Pending')  # Pending, Approved, Closed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    drive_id = db.Column(db.Integer, db.ForeignKey('placement_drive.id'), nullable=False)
    application_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='Applied')  # Applied, Shortlisted, Selected, Rejected
    resume_path = db.Column(db.String(200))

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username, password=password).first()
        
        if user and user.is_active:
            session['user_id'] = user.id
            session['role'] = user.role
            
            if user.role == 'admin':
                return redirect(url_for('admin_dashboard'))
            elif user.role == 'company' and user.is_approved:
                return redirect(url_for('company_dashboard'))
            elif user.role == 'student' and user.is_approved:
                return redirect(url_for('student_dashboard'))
            else:
                flash('Account not approved yet.')
        else:
            flash('Invalid credentials')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# Admin routes
@app.route('/admin/dashboard')
def admin_dashboard():
    if 'user_id' not in session or session.get('role') != 'admin':
        return redirect(url_for('login'))
    
    total_students = Student.query.join(User).filter(User.is_active==True).count()
    total_companies = Company.query.join(User).filter(User.is_active==True).count()
    total_drives = PlacementDrive.query.count()
    total_applications = Application.query.count()
    
    pending_companies = User.query.filter_by(role='company', is_approved=False).all()
    pending_drives = PlacementDrive.query.filter_by(status='Pending').all()
    
    return render_template('admin/dashboard.html', 
                          total_students=total_students,
                          total_companies=total_companies,
                          total_drives=total_drives,
                          total_applications=total_applications,
                          pending_companies=pending_companies,
                          pending_drives=pending_drives)

@app.route('/admin/approve_company/<int:user_id>')
def approve_company(user_id):
    if 'user_id' not in session or session.get('role') != 'admin':
        return redirect(url_for('login'))
    
    user = User.query.get_or_404(user_id)
    user.is_approved = True
    db.session.commit()
    flash('Company approved successfully')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/reject_company/<int:user_id>')
def reject_company(user_id):
    if 'user_id' not in session or session.get('role') != 'admin':
        return redirect(url_for('login'))
    
    user = User.query.get_or_404(user_id)
    user.is_active = False
    db.session.commit()
    flash('Company rejected')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/approve_drive/<int:drive_id>')
def approve_drive(drive_id):
    if 'user_id' not in session or session.get('role') != 'admin':
        return redirect(url_for('login'))
    
    drive = PlacementDrive.query.get_or_404(drive_id)
    drive.status = 'Approved'
    db.session.commit()
    flash('Placement drive approved')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/reject_drive/<int:drive_id>')
def reject_drive(drive_id):
    if 'user_id' not in session or session.get('role') != 'admin':
        return redirect(url_for('login'))
    
    drive = PlacementDrive.query.get_or_404(drive_id)
    drive.status = 'Closed'
    db.session.commit()
    flash('Placement drive rejected')
    return redirect(url_for('admin_dashboard'))

# Company routes
@app.route('/company/register', methods=['GET', 'POST'])
def company_register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        name = request.form['name']
        hr_contact = request.form['hr_contact']
        website = request.form['website']
        
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists')
            return render_template('company/register.html')
        
        # Create user
        user = User(username=username, password=password, role='company', is_approved=False)
        db.session.add(user)
        db.session.flush()  # To get the user id
        
        # Create company
        company = Company(user_id=user.id, name=name, hr_contact=hr_contact, website=website)
        db.session.add(company)
        db.session.commit()
        
        flash('Registration successful. Wait for admin approval.')
        return redirect(url_for('login'))
    
    return render_template('company/register.html')

@app.route('/company/dashboard')
def company_dashboard():
    if 'user_id' not in session or session.get('role') != 'company':
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    if not user.is_approved:
        flash('Your account is not approved yet.')
        return redirect(url_for('login'))
    
    company = Company.query.filter_by(user_id=user.id).first()
    drives = PlacementDrive.query.filter_by(company_id=company.id).all()
    
    drive_stats = []
    for drive in drives:
        applicant_count = Application.query.filter_by(drive_id=drive.id).count()
        drive_stats.append({
            'drive': drive,
            'applicant_count': applicant_count
        })
    
    return render_template('company/dashboard.html', company=company, drive_stats=drive_stats)

@app.route('/company/create_drive', methods=['GET', 'POST'])
def create_drive():
    if 'user_id' not in session or session.get('role') != 'company':
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    if not user.is_approved:
        flash('Your account is not approved yet.')
        return redirect(url_for('company_dashboard'))
    
    if request.method == 'POST':
        company = Company.query.filter_by(user_id=user.id).first()
        job_title = request.form['job_title']
        job_description = request.form['job_description']
        eligibility_criteria = request.form['eligibility_criteria']
        deadline = request.form['deadline']
        
        drive = PlacementDrive(
            company_id=company.id,
            job_title=job_title,
            job_description=job_description,
            eligibility_criteria=eligibility_criteria,
            application_deadline=datetime.strptime(deadline, '%Y-%m-%d').date(),
            status='Pending'
        )
        db.session.add(drive)
        db.session.commit()
        
        flash('Placement drive created successfully. Waiting for admin approval.')
        return redirect(url_for('company_dashboard'))
    
    return render_template('company/create_drive.html')

@app.route('/company/drive_applicants/<int:drive_id>')
def drive_applicants(drive_id):
    if 'user_id' not in session or session.get('role') != 'company':
        return redirect(url_for('login'))
    
    drive = PlacementDrive.query.get_or_404(drive_id)
    company = Company.query.filter_by(user_id=session['user_id']).first()
    
    if drive.company_id != company.id:
        flash('Unauthorized access')
        return redirect(url_for('company_dashboard'))
    
    applications = Application.query.filter_by(drive_id=drive_id).all()
    students = []
    for app in applications:
        student = Student.query.get(app.student_id)
        students.append({'application': app, 'student': student})
    
    return render_template('company/drive_applicants.html', students=students, drive=drive)

@app.route('/company/update_status/<int:app_id>/<status>')
def update_application_status(app_id, status):
    if 'user_id' not in session or session.get('role') != 'company':
        return redirect(url_for('login'))
    
    application = Application.query.get_or_404(app_id)
    drive = PlacementDrive.query.get(application.drive_id)
    company = Company.query.filter_by(user_id=session['user_id']).first()
    
    if drive.company_id != company.id:
        flash('Unauthorized access')
        return redirect(url_for('company_dashboard'))
    
    application.status = status
    db.session.commit()
    flash(f'Application status updated to {status}')
    return redirect(url_for('drive_applicants', drive_id=drive.id))

# Student routes
@app.route('/student/register', methods=['GET', 'POST'])
def student_register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        roll_number = request.form['roll_number']
        department = request.form['department']
        cgpa = float(request.form['cgpa']) if request.form['cgpa'] else None
        
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists')
            return render_template('student/register.html')
        
        # Create user
        user = User(username=username, password=password, role='student', is_approved=True)
        db.session.add(user)
        db.session.flush()
        
        # Create student
        student = Student(
            user_id=user.id,
            name=name,
            email=email,
            phone=phone,
            roll_number=roll_number,
            department=department,
            cgpa=cgpa
        )
        db.session.add(student)
        db.session.commit()
        
        flash('Registration successful')
        return redirect(url_for('login'))
    
    return render_template('student/register.html')

@app.route('/student/dashboard')
def student_dashboard():
    if 'user_id' not in session or session.get('role') != 'student':
        return redirect(url_for('login'))
    
    student = Student.query.filter_by(user_id=session['user_id']).first()
    
    # Get approved placement drives
    approved_drives = PlacementDrive.query.filter_by(status='Approved').all()
    
    # Get student's applications
    applications = Application.query.filter_by(student_id=student.id).all()
    
    # Get placement history (selected applications)
    placement_history = Application.query.filter_by(student_id=student.id, status='Selected').all()
    
    return render_template(
        'student/dashboard.html',
        student=student,
        drives=approved_drives,
        applications=applications,
        placement_history=placement_history
    )

@app.route('/student/apply/<int:drive_id>')
def apply_for_drive(drive_id):
    if 'user_id' not in session or session.get('role') != 'student':
        return redirect(url_for('login'))
    
    # Check if already applied
    existing_app = Application.query.filter_by(
        student_id=Student.query.filter_by(user_id=session['user_id']).first().id,
        drive_id=drive_id
    ).first()
    
    if existing_app:
        flash('You have already applied for this drive')
        return redirect(url_for('student_dashboard'))
    
    application = Application(
        student_id=Student.query.filter_by(user_id=session['user_id']).first().id,
        drive_id=drive_id,
        status='Applied'
    )
    db.session.add(application)
    db.session.commit()
    
    flash('Successfully applied for the drive')
    return redirect(url_for('student_dashboard'))

@app.route('/student/profile/edit', methods=['GET', 'POST'])
def edit_profile():
    if 'user_id' not in session or session.get('role') != 'student':
        return redirect(url_for('login'))
    
    student = Student.query.filter_by(user_id=session['user_id']).first()
    
    if request.method == 'POST':
        student.name = request.form['name']
        student.email = request.form['email']
        student.phone = request.form['phone']
        student.department = request.form['department']
        student.cgpa = float(request.form['cgpa']) if request.form['cgpa'] else None
        student.roll_number = request.form['roll_number']
        
        db.session.commit()
        flash('Profile updated successfully')
        return redirect(url_for('edit_profile'))
    
    return render_template('student/edit_profile.html', student=student)

# Initialize database and create admin user
def init_db():
    db.create_all()
    
    # Check if admin user exists
    admin_user = User.query.filter_by(username='admin', role='admin').first()
    if not admin_user:
        admin_user = User(username='admin', password='admin123', role='admin', is_approved=True)
        db.session.add(admin_user)
        db.session.commit()
        print("Admin user created: username=admin, password=admin123")

if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True)