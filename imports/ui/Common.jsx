import React, { Component } from "react"

import Avatar from "material-ui/Avatar/Avatar"
import Typography from "material-ui/Typography/Typography";

export function UserAvatar(props) {
    const { username } = props.user || { username: "?" }

    const usernameShort = username.slice(0, 1).toUpperCase()

    return (
        <Avatar alt={username} {...props}>{usernameShort}</Avatar>
    )
}

export function EurText(props) {
    const { amount } = props
    const prefix = props.prefix || ""
    delete props.amount
    delete props.prefix
    return (
        <Typography {...props}>{prefix + amount.toFixed(2) + "€"}</Typography>
    )
}
