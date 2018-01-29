import React, { Component } from "react"

import Avatar from "material-ui/Avatar/Avatar"

export function UserAvatar(props) {
    const { username } = props.user || { username: "?" }

    const usernameShort = username.slice(0, 1).toUpperCase()

    return (
        <Avatar alt={username} {...props}>{usernameShort}</Avatar>
    )
}