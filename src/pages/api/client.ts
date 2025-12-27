import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

const script_clients = `SELECT * FROM matchprodb.clients`;
const script_client_activities = `SELECT * FROM matchprodb.client_activities`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [rows_clients] = await matchprodb.query<any[]>(script_clients);
  const [rows_client_activities] = await matchprodb.query<any[]>(script_client_activities);

  // Build activity index by client_id for O(1) lookup
  const activitiesMap = new Map<number, any[]>();
  for (const activity of rows_client_activities) {
    const clientId = activity.client_id;
    if (!activitiesMap.has(clientId)) activitiesMap.set(clientId, []);
    activitiesMap.get(clientId)!.push({
      type: activity.type,
      description: activity.description,
      date: activity.activity_date
    });
  }

  // Map clients with single pass using indexed activities
  const clients = rows_clients.map(client => ({
    id: client.id,
    name: client.name,
    industry: client.industry,
    size: client.size,
    location: client.location,
    contactPerson: client.contact_person,
    email: client.email,
    phone: client.phone,
    status: client.status,
    joinedDate: client.joinedDate,
    activeJobs: Number(client.activeJobs),
    totalHires: Number(client.totalHires),
    revenue: Number(client.revenue),
    logo: client.logo,
    description: client.description,
    recentActivity: activitiesMap.get(client.id) || []
  }));

  res.status(200).json(clients);
}