"use client"

import * as React from "react"
import {getAvailableYears, getPayments} from "@/app/expenses/makeData";
import {useState} from "react";
import {columns, Payment} from "@/app/expenses/components/columns";
import {DataTable} from "@/app/expenses/components/data-table";


export function HomePage() {
    const availableYears = getAvailableYears();
    availableYears.push("All")
    const [selectedYear, setSelectedYear] = useState(availableYears[0]);

    const data: Payment[] = getPayments(selectedYear);
    const previousYear = parseInt(selectedYear) - 1

    const previousYearTotals = availableYears.includes(previousYear.toString())
        ? getPayments(previousYear.toString()).reduce((sum, current) => sum + parseFloat(current.amount), 0)
        : 0

    return (
        <div className="container mx-auto p-6">
            <DataTable previousYearTotals={previousYearTotals} data={data} columns={columns} availableYears={availableYears} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
        </div>

    )
}

