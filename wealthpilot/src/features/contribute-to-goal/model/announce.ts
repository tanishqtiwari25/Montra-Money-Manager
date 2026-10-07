import { goalApi, useGoals, type Goal } from '@entities/goal';
import { notificationApi, useNotifications } from '@entities/notification';
const announcing = new Set<string>();
export async function announceGoalAchievement(goal: Goal): Promise<boolean> {
  const current = useGoals.getState().items.find(item => item.id === goal.id);
  if (goal.status !== 'achieved' || goal.achievementAnnounced || current?.achievementAnnounced || announcing.has(goal.id)) return false;
  announcing.add(goal.id);
  try {
    const notification = await notificationApi.create({ kind: 'goal-achieved', title: 'You reached your ' + goal.name + ' goal!', message: 'You can now afford ' + goal.name + ' based on your salary and savings.', href: '/goals', sourceKey: 'goal:' + goal.id });
    useNotifications.getState().upsert(notification);
    useGoals.getState().upsert(await goalApi.acknowledgeAchievement(goal.id));
    return true;
  } finally { announcing.delete(goal.id); }
}
