"use client"

import { useAppDispatch } from "@/store/hooks"
import { fetchMe } from "@/store/slices/authSlice"
import { useEffect } from "react"

export default function AuthInit() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchMe())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null
}