export function initialData() {
  return {
    version: 1,
    tasks: [
      { id: 'invite', title: 'RSVP to the Innovations Hub weekly session invite', description: 'Tymon updated the weekly incubator session. Your attendance is optional, and the invitation is still unanswered.', source: 'Calendar', time: 'Tomorrow 6:00 PM', status: 'review', kind: 'calendar', action: 'RSVP', draft: 'Yes, I’ll join the next Innovations Hub weekly session.' },
      { id: 'cooper', title: 'Reply to Cooper about the Cofounder walkthrough', description: 'Cooper is waiting to hear whether you’ll join a walkthrough Oct 28–30 or prefer a 1:1.', source: 'Email', time: '21h ago', status: 'review', kind: 'mail', action: 'Open draft', draft: 'Hi Cooper, thanks for reaching out. I’d love to join the next Cofounder walkthrough. Could you share the available sessions? Best, Leo' },
      { id: 'deck', title: 'Let Me Build You an 8 Slide Deck', description: 'I’ll research a topic of your choice and turn it into a deck you can share.', source: 'Hermes', time: '8h ago', status: 'review', kind: 'file', action: 'Review', draft: '1. Overview\n2. The opportunity\n3. Audience\n4. Positioning\n5. Product\n6. Distribution\n7. Milestones\n8. Next steps' },
      { id: 'brief', title: 'Daily Brief', description: 'Your morning overview of meetings, messages, and priorities.', source: 'Hermes', time: '6:59 AM', status: 'review', kind: 'file', action: 'Review', draft: 'Today’s priorities\n\n• Reply to Cooper about the walkthrough.\n• Confirm the Innovations Hub invitation.\n• Review the Aurora visibility plan.' },
      { id: 'dream', title: 'Dreaming', description: 'Archiving dream rows and organizing what Hermes learned.', source: 'Hermes', time: '3:28 AM', status: 'review', kind: 'sparkles', action: 'Review', draft: 'Organized project notes and extracted recurring preferences. No external changes were made.' },
      { id: 'cancel', title: 'Cancel the 3pm meeting by email', description: 'Confirming email sent', source: 'Email', time: 'Oct 27', status: 'done', kind: 'mail', action: 'View', draft: 'Hi, I need to cancel our 3pm meeting. Let’s find another time that works.' }
    ],
    routines: [
      { id: 'dreaming', title: 'Dreaming', schedule: 'Every day at 3:00 AM', channel: 'Hermes', active: true, next: 'Next run in 12 hours', prompt: 'Review recent notes and organize useful learnings.' },
      { id: 'daily', title: 'Daily Brief', schedule: 'Every day at 6:30 AM', channel: 'Email', active: true, next: 'Next run in 16 hours', prompt: 'Summarize my upcoming meetings, unanswered messages, and top priorities.' },
      { id: 'visibility', title: 'Aurora AI visibility tracker (weekly)', schedule: 'Every Monday at 8:00 AM', channel: 'Hermes', active: true, next: 'Next run in 5 days', prompt: 'Review the Aurora visibility plan and prepare a weekly update.' }
    ],
    files: [
      { id: 'aurora', title: 'aurora-geo', content: '# Aurora GEO plan\n\nImprove discoverability across AI-powered search.\n\n## This week\n- Review the content inventory\n- Identify useful primary sources\n- Prepare the first visibility report', pinned: false, updated: 'Oct 27', type: 'md' },
      { id: 'company', title: 'COMPANY.md', content: '# Company\n\nAurora is the current workspace. Keep research grounded in primary sources and ask before publishing or contacting anyone.', pinned: true, updated: 'Oct 26', type: 'md' },
      { id: 'tools', title: 'TOOLS.md', content: '# Tools\n\nThis prototype uses local mock tools. Replace the tool adapter to connect real calendar, email, file, and agent services.', pinned: true, updated: 'Oct 26', type: 'md' }
    ],
    memory: [
      { id: 'm1', title: 'Preferred working style', content: 'Short, practical updates. Ask before sending external messages.' },
      { id: 'm2', title: 'Current project', content: 'Aurora — research, positioning, and AI visibility.' }
    ],
    messages: [],
    sidebarExpanded: false
  };
}
