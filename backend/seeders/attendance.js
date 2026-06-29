const Attendance = require('../models/Attendance');
const Salesman = require('../models/Salesman');
const Company = require('../models/Company');

const seedAttendance = async () => {
  try {
    const count = await Attendance.countDocuments();

    if (count > 0) {
      console.log('✓ Attendance records already exist');
      return;
    }

    const company = await Company.findOne();
    const salesmen = await Salesman.find({ tenantId: company._id });

    if (!company || salesmen.length === 0) {
      throw new Error('Required entities not found. Seed companies and salesmen first.');
    }

    const attendance = [];
    const today = new Date();

    // Generate 30 days of attendance records
    for (let day = 30; day >= 0; day--) {
      const attendanceDate = new Date(today);
      attendanceDate.setDate(attendanceDate.getDate() - day);
      attendanceDate.setHours(0, 0, 0, 0);

      for (const salesman of salesmen) {
        // Random attendance status
        const statuses = ['present', 'absent', 'on-leave', 'half-day'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        if (status === 'absent' || status === 'on-leave') {
          // No check-in/out for absent/on-leave
          attendance.push({
            tenantId: company._id,
            salesman: salesman._id,
            attendanceDate,
            status,
            approvalStatus: 'pending'
          });
        } else {
          // Generate check-in/out times
          const checkInHour = 9 + Math.floor(Math.random() * 2);
          const checkInMinute = Math.floor(Math.random() * 60);
          const checkInTime = new Date(attendanceDate);
          checkInTime.setHours(checkInHour, checkInMinute, 0, 0);

          const checkOutHour = 17 + Math.floor(Math.random() * 2);
          const checkOutMinute = Math.floor(Math.random() * 60);
          const checkOutTime = new Date(attendanceDate);
          checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);

          const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

          // Random GPS coordinates anywhere on Earth; live check-ins use actual device location.
          const latitude = (Math.random() * 180) - 90;
          const longitude = (Math.random() * 360) - 180;

          attendance.push({
            tenantId: company._id,
            salesman: salesman._id,
            attendanceDate,
            status: status === 'half-day' ? 'present' : status,
            checkInTime,
            checkOutTime,
            workingHours: Math.round(workingHours * 100) / 100,
            checkInLocation: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            checkOutLocation: {
              type: 'Point',
              coordinates: [longitude + 0.01, latitude + 0.01]
            },
            plannedVisits: 5 + Math.floor(Math.random() * 5),
            completedVisits: 3 + Math.floor(Math.random() * 4),
            ordersGenerated: 1 + Math.floor(Math.random() * 3),
            collectionsRecorded: 1 + Math.floor(Math.random() * 2),
            approvalStatus: 'pending'
          });
        }
      }
    }

    const created = await Attendance.insertMany(attendance);
    console.log(`✓ Created ${created.length} attendance records`);
  } catch (error) {
    console.error('✗ Error seeding attendance:', error.message);
    throw error;
  }
};

module.exports = seedAttendance;
