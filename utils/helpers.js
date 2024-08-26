function getReminders(dateString) {
    const duration = new Date(dateString) - Date.now();
    const reminders = [
        duration / 4,
        duration / 2,
        3 * duration / 4
    ];
    return reminders.map(ele => new Date(Date.now() + ele));
}

export { getReminders };