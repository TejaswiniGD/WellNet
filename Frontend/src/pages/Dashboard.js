import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import MainLayout from './MainLayout';
import '../style/admin.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [availableDoctors, setAvailableDoctors] = useState(0);
  const [availableReceptionists, setAvailableReceptionists] = useState(0);
  const [patientToDoctor, setPatientToDoctor] = useState([]);
  const [attendedPatients, setAttendedPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const [patientDoctorPage, setPatientDoctorPage] = useState(0);
  const itemsPerPage = 3; // Number of items per page

  // Pagination state for Available Doctors
  const [doctorPage, setDoctorPage] = useState(0);

  // Pagination state for Attended Patient History
  const [attendedPatientsPage, setAttendedPatientsPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const patientRes = await axios.get('http://localhost:5000/api/patients', {
          headers: { 'x-auth-token': token },
        });

        const patients = patientRes.data.map(patient => {
          const formattedDate = new Date(patient.date).toLocaleDateString('en-US');       // to formate date and time 
          return { ...patient, formattedDate };
        });

        const total = patients.length;   // to display total number of patients
        const completedAppointments = patients.filter(patient => patient.status === 'History').length;
        const ongoingAppointments = total - completedAppointments;

        setTotalPatients(total); 
        setAppointments(ongoingAppointments);
        setPatientToDoctor(patients);

        const doctorsRes = await axios.get('http://localhost:5000/api/emp/doctors', {
          headers: { 'x-auth-token': token },
        });

        setAvailableDoctors(doctorsRes.data.length);  // number of doctors
        setDoctors(doctorsRes.data);   // actual doctors

        const employeesRes = await axios.get('http://localhost:5000/api/emp/get', {
          headers: { 'x-auth-token': token },
        });

        const receptionists = employeesRes.data.filter(employee => employee.role === 'receptionist');
        setAvailableReceptionists(receptionists.length);

        // Fetch attended patients with status "History"
        try{
          const attendedPatientsRes = await axios.get('http://localhost:5000/api/patients/attended/patients', {
            headers: { 'x-auth-token': token },
          });

          setAttendedPatients(attendedPatientsRes.data);
        }catch(err){
          console.log(err.message);
        }

      } catch (err) {
        console.error(err.message);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const handlePatientDoctorPageClick = (data) => {
    setPatientDoctorPage(data.selected);
  };

  const handleDoctorPageClick = (data) => {
    setDoctorPage(data.selected);
  };

  const handleAttendedPatientsPageClick = (data) => {
    setAttendedPatientsPage(data.selected);
  };

  // Filtered and paginated data
  const displayedPatientToDoctor = patientToDoctor.slice(patientDoctorPage * itemsPerPage, (patientDoctorPage + 1) * itemsPerPage);
  const displayedDoctors = doctors.slice(doctorPage * itemsPerPage, (doctorPage + 1) * itemsPerPage);
  const displayedAttendedPatients = attendedPatients.slice(attendedPatientsPage * itemsPerPage, (attendedPatientsPage + 1) * itemsPerPage);

  const getStatusButton = (status) => {
    switch (status) {
      case 'Ongoing':
        return <button className='ongoing'>Ongoing</button>;
      case 'Complete':
        return <button className='Complete'>Complete</button>;
      case 'Testing':
        return <button className='testing'>Testing</button>
      case 'Yet to check':
        return <button className='yet-to-check'>Registered</button>
      default:
        return <button className='Complete'>Complete</button>;
    }
  };
  return (
    <MainLayout>
      <div className="doc-container">
        <div className="greetings">
          <h3>Welcome, Admin</h3>
          <span className='wish'>Have a nice day at work</span>
        </div>
        <div className="cards">
          <div className="card-one">
            <div className="icon">
              <div className="item">
                <i className="bi bi-clipboard"></i>
              </div>
            </div>
            <div className="info">
              <h2>{appointments}</h2>
              <p>Appointments</p>
            </div>
          </div>
          
          <div className="card-two">
            <div className="icon">
              <div className="item">
                <i className="bi bi-person"></i>
              </div>
            </div>
            <div className="info">
              <h2>{totalPatients}</h2>
              <p>Total Patients</p>
            </div>
          </div>

          <div className="card-three">
            <div className="icon">
              <div className="item">
                <i className="bi bi-check2-square"></i>
              </div>
            </div>
            <div className="info">
              <h2>{availableDoctors}</h2>
              <p>Available Doctors</p>
            </div>
          </div>

          <div className="card-four">
            <div className="icon">
              <div className="item">
                <i className="bi bi-hourglass-split"></i>
              </div>
            </div>
            <div className="info">
              <h2>{availableReceptionists}</h2>
              <p>Available Receptionists</p>
            </div>
          </div>
        </div>

        <div className="control-pannel">
          <div className="patient-to-doctor">
            <h3>Patients and Their Doctors</h3>
            <div className="patient-to-doctor-card">
              {displayedPatientToDoctor.map((item, index) => (
                <div key={index} className="profile-info">
                  <div className="patient-info">
                    <h3>{item.firstName}</h3>
                    <p>{item.age} {item.gender} {item.formattedDate} {item.time}</p>
                  </div>
                  <div className='rep-status-button'>
                      {getStatusButton(item.status)}
                    </div>
                  <div className="doctor-info">
                    <h3>Dr. {item.doctor.firstName}</h3>
                    <p>{item.doctor.role} {item.doctor.phoneNumber}</p>
                  </div>
                </div>
              ))}
              <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={Math.ceil(patientToDoctor.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePatientDoctorPageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
              />
            </div>
          </div>

          <div className="total-dotors">
            <h3>Available Doctors</h3>
            <div className="total-doctor-card">
              {displayedDoctors.map((item, index) => (
              <div key={index} className="doc-profile-info">
                <div className="doc-info">
                  <h3>Dr. {item.firstName} {item.lastName}</h3>
                  <p>{item.role} ({item.gender}) <br /> {item.phoneNumber}</p>
                </div>
                <div className="contact">
                  <button><i className="bi bi-envelope"></i> <span className="space">..</span> mail</button>
                </div>
              </div>
              ))}
              <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={Math.ceil(doctors.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handleDoctorPageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
              />
            </div>
          </div>
        </div>

        <div className="attended-patients">
          <h3>Attended Patient History</h3>
          <div className="att-container">
            <table>
              <thead>
                <tr>
                  <th>Sl.no</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Medical</th>
                  <th>Patient</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {displayedAttendedPatients.map((patient, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{patient.firstName}</td>
                    <td>{patient.age}</td>
                    <td>{patient.medicalCondition}</td>
                    <td>{patient.patientType}</td>
                    <td>{patient.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={'previous'}
              nextLabel={'next'}
              breakLabel={'...'}
              pageCount={Math.ceil(attendedPatients.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handleAttendedPatientsPageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
