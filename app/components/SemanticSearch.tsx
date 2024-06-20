"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { getUniqueCities, getUniqueProvinces, operators } from "@/app/utils"
const cities = getUniqueCities()
const provinces = getUniqueProvinces()
// const charityCategories = getCharityCategories()

export default function SemanticSearch({ setSearchResults, setSearchType }: any) {
    const [query, setQuery] = useState("")
    const [limit, setLimit] = useState(10)
    const [city, setCity] = useState("none")
    const [province, setProvince] = useState("none")
    const [donations, setDonations] = useState(0)
    const [donationsOperator, setDonationsOperator] = useState("$gt")
    const [revenue, setRevenue] = useState(0)
    const [revenueOperator, setRevenueOperator] = useState("$gt")
    const [loading, setLoading] = useState(false)

    const handleSearch = () => {
        console.log(`Searching for ${query} with limit ${limit}`)
        console.log(`City: ${city}`)
        console.log(`Province: ${province}`)
        console.log(`Donations: ${donations} ${donationsOperator}`)
        console.log(`Revenue: ${revenue} ${revenueOperator}`)

        setLoading(true);

        let metadata = {
            totalAmountOfGiftsPaidToQualfiiiedDonees: { [donationsOperator]: donations },
            revenue: { [revenueOperator]: revenue }
        }
        if (city !== "none") {            
            metadata.city = city
        }
        if (province !== "none") {
            metadata.province = province
        }

        const queryParams = new URLSearchParams({
            query,
            limit: limit.toString(),
            metadata: JSON.stringify(metadata),
        }).toString();

        fetch(`https://charity-data-2023-04082f812920.herokuapp.com/search?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Search results:', data);
            setSearchResults(data);
            setSearchType("results");
            setLoading(false);
        })
        .catch(error => {
            console.error('Error during search:', error);
            setLoading(false);
        });
    }

    return (
        <div className="py-4">
            <p className="pb-4">
                Use this to search for charities that match your description. This search uses semantic vector search to find charities that are similar to the description you provide. The vector database is only seeded with 2023 charities in the Christianity category (4002 records).
            </p>
            <Textarea name="query" placeholder="Enter your query here" className="mb-4" value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="flex gap-2 mb-4">
                <div className="flex flex-col gap-1 w-[100px]">
                    <Label htmlFor="limit">Limit</Label>
                    <Input name="limit" type="number" defaultValue={10} onChange={(e) => setLimit(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="city">City</Label>
                    <select className="w-[180px]" onChange={(e) => setCity(e.target.value)}>
                        <option value="none">None</option>
                        {cities.map((city) => (
                            <option key={city.name} value={city.name}>{city.name} ({city.count})</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="province">Province</Label>
                    <select className="w-[180px]" onChange={(e) => setProvince(e.target.value)}>
                        <option value="none">None</option>
                        {provinces.map((province) => (
                            <option key={province.name} value={province.name}>{province.name} ({province.count})</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex gap-2 mb-4">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="donations">Donations</Label>
                    <div className="flex gap-2">
                        <select className="w-[100px]" onChange={(e) => setDonationsOperator(e.target.value)} value={donationsOperator}>
                            {operators.map((operator) => (
                                <option key={operator} value={operator}>{operator}</option>
                            ))}
                        </select>
                        <Input name="donations" type="number" defaultValue={0} onChange={(e) => setDonations(Number(e.target.value))} />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="revenue">Revenue</Label>
                    <div className="flex gap-2">
                        <select className="w-[100px]" onChange={(e) => setRevenueOperator(e.target.value)} value={revenueOperator}>
                            {operators.map((operator) => (
                                <option key={operator} value={operator}>{operator}</option>
                            ))}
                        </select>
                        <Input name="revenue" type="number" defaultValue={0} onChange={(e) => setRevenue(Number(e.target.value))} />
                    </div>
                </div>
            </div>
            <Button onClick={handleSearch}>Search</Button>
        </div>
    )
}

