export const roleNames = { admin: 'Administrator', trainer: 'Trainer', employee: 'Employee' }
export const roleNav = {
  admin: [['Overview', 'LayoutDashboard'], ['People', 'Users'], ['Domains', 'BriefcaseBusiness'], ['Courses', 'BookOpen'], ['Assignment rules', 'ClipboardCheck'], ['Approvals', 'FileCheck2'], ['Reports', 'Activity'], ['Audit log', 'ShieldCheck'], ['Settings', 'Settings']],
  trainer: [['Overview', 'LayoutDashboard'], ['My courses', 'BookOpen'], ['Certificate reviews', 'FileCheck2'], ['Analytics', 'Activity'], ['Notifications', 'Bell']],
  employee: [['My learning', 'LayoutDashboard'], ['My certificates', 'FileCheck2'], ['Notifications', 'Bell']],
}
export function messageOf(error) { return error?.message || 'Something went wrong. Please try again.' }
export function records(value) {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') return []
  for (const key of ['items', 'results', 'rows', 'records', 'users', 'courses', 'assignments', 'certificates', 'notifications', 'domains', 'rules', 'logs']) if (Array.isArray(value[key])) return value[key]
  return []
}
export function initials(name = '') { return name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase() || 'N' }
export function pretty(value = '') { return String(value).replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) }
export function date(value) { return value ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : '—' }
export function statusClass(value = '') { return `status status-${String(value).toLowerCase().replaceAll('_', '-')}` }
export function statValue(obj, ...keys) { for (const key of keys) if (obj?.[key] !== undefined && obj?.[key] !== null) return obj[key]; return 0 }
