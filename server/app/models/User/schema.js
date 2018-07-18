import UserProfile from './UserProfile'
import UserEmail from './UserEmail'

export default {
  _id: {
    type: 'ID'
  },
  emails: {
    type: [UserEmail]
  },
  createdAt: {
    type: Date
  },
  services: {
    type: 'blackbox',
    private: true
  },
  profile: {
    type: UserProfile,
    optional: true
  },
  roles: {
    type: ['ID'],
    optional: true,
    defaultValue: []
  },
  stripeCustomerId: {
    type: String,
    optional: true,
    private: true
  }
}
