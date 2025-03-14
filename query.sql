CREATE TABLE IF NOT EXISTS organizations (
    organization_id INTEGER PRIMARY KEY, 
    organization_name TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS channels (
    channel_id INTEGER PRIMARY KEY,
    channel_name TEXT NOT NULL,
    organization_id INTEGER NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    user_name TEXT NOT NULL 
);
                        
CREATE TABLE IF NOT EXISTS message (
    message_id INTEGER PRIMARY KEY,
    post_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    user_id_posted INTEGER NOT NULL,
    channel_id_posted INTEGER NOT NULL,
    FOREIGN KEY (user_id_posted) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (channel_id_posted) REFERENCES channels(channel_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS channel_subscribed_by_users (
    subscription_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    channel_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, 
    FOREIGN KEY (channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE
);