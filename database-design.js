const db = {
    //user collection or table
    "Users": [
      {
        email: {
          type: String,
          required: true,
          unique: true,
          match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
          type: String,
          required: true,
          default: ''
        },
        username:{
          type: String,
          required: true,
          default: ''
        },
        
        pas_cg_rq: {
          type: Boolean,
          required: true,
          default: false
        },
        user_type: {
          type: String,
          required: true,
        },
      }
    ],
    "patients": [
      {
        patient_id: {
          type: ObjectId,
          required: true,
          unique: true,
        },
        username: {
          type: String,
          required: true,
          default: ''
        },
        
        img: {
          type: String,
        },
        details: {
          type: Object,
          required: true,

        },
      }
    ],
    "doctors": [
      {
        doctor_id: {
          type: ObjectId,
          required: true,
          unique: true,
        },
        username: {
          type: String,
          required: true,
          default: ''
        },
        img: {
          type: String,
        },
        details: {
          type: Object,
          required: true,
        },
        institute: {
          type: String,
          required: true,

        },


      }
    ],
    "appointments": [
      {
        patient_id: {
          type: ObjectId,
          required: true,
        },
        doctor_id: {
          type: ObjectId,
          required: true,
        },
        
        date: {
          type: String,
          required: true,
        },
        details:{
          type: Object,
          required: true
        }
      }
    ],
    "prescriptions": [
      {
        patient_id: {
          type: ObjectId,
          required: true,
        },
        doctor_id: {
          type: ObjectId,
          required: true,
        },
        
        date: {
          type: String,
          required: true,
        },
        details:{
          type: Object,
          required: true
        },
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      }
    ],
    "pharmacies": [
      {
        _id: {
          type: ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      }
    ],
    "nurse": [
      {
        nurse_id: {
          type: ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        details: {
          type: Object,
          required: true,

        },
        institute: {
          type: String,
          required: true,

        },
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      }
    ]
  }