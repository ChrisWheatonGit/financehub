"use client";
import Link from "next/link";
import HouseholdAccess from "@/components/household-access";
export default function HouseholdPage(){return <main style={{padding:32,minHeight:'100vh',background:'var(--background)',color:'var(--foreground)'}}><p><Link href="/">← Demo dashboard</Link></p><HouseholdAccess/></main>}
