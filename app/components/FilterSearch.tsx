import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { useState } from "react";

import { getUniqueCities, getUniqueProvinces, operators, getCharityCategories, getCharitySubcategories } from "@/app/utils"
const cities = getUniqueCities()
const provinces = getUniqueProvinces()
const categories = getCharityCategories()
const subcategories = getCharitySubcategories()

export default function FilterSearch() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [city, setCity] = useState("none")
    const [province, setProvince] = useState("none")
    const [filteredResults, setFilteredResults] = useState([]);
    const [area, setArea] = useState("none")
    const [category, setCategory] = useState("none")
    const [subcategory, setSubcategory] = useState("none")

    const handleSearch = async () => {
        const filters = {};
        if (city !== "none" && city !== "") filters.city = city;
        if (province !== "none" && province !== "") filters.province = province;
        if (area !== "none" && area !== "") filters.area = area;
        if (category !== "none" && category !== "") filters.category = category;
        if (subcategory !== "none" && subcategory !== "") filters.subcategory = subcategory;

        const queryParams = new URLSearchParams({
            query: encodeURIComponent(query),
            filters: JSON.stringify(filters)
        }).toString();

        const res = await fetch(`/api/data?${queryParams}`, {
            method: 'GET',
        });
        const data = await res.json();
        console.log("data:", data);
        setSearchResults(data.results);
        setFilteredResults(data.results);
    }

    const handleFilterSearch = (e: any) => {
        console.log('hnadlefiltersearch', e.target.value);
        const filterValue = e.target.value.toLowerCase();
        const filtered = searchResults.filter(charity => {
            return charity.bn.includes(filterValue) ||
                   charity.legalName.toLowerCase().includes(filterValue.toLowerCase()) ||
                   charity.legalNameRaw.toLowerCase().includes(filterValue.toLowerCase()) ||
                   charity.accountName.toLowerCase().includes(filterValue.toLowerCase()) ||
                   charity.description.toLowerCase().includes(filterValue.toLowerCase());
        });
        setFilteredResults(filtered);
        console.log(filteredResults);
    }

    const createCharityDataUrl = (charity: any) => `https://charitydata.ca/charity/${charity.accountName.replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,\/#!$%\^&\*;:{}=`~()]/g,"")}/${charity.bn}`


    return (
        <div className="py-4">
            <div className="flex flex-col gap-2 mb-4">
                <p>
                    The search input will match business number, name, and description. You can further refine your search by selecting the filter options below.
                </p>
                <Input name="query" type="text" value={query} placeholder="Search" onChange={(e) => setQuery(e.target.value)} />

                <div className="flex gap-2 mb-4 w-full">
                    <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="city">City</Label>
                        <select className="w-full" onChange={(e) => setCity(e.target.value)}>
                            <option value="none">None</option>
                            {cities.map((city) => (
                                <option key={city.name} value={city.name}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="province">Province</Label>
                        <select className="w-full" onChange={(e) => setProvince(e.target.value)}>
                            <option value="none">None</option>
                            {provinces.map((province) => (
                                <option key={province.name} value={province.name}>{province.name}</option>
                            ))}
                        </select>
                    </div>                   
                    <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="area">Area</Label>
                        <select className="w-full" onChange={(e) => setArea(e.target.value)}>
                            <option value="none">None</option>
                            {Object.keys(categories).map((categoryKey) => (
                                <option key={categoryKey} value={categoryKey}>{categoryKey}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="category">Category</Label>
                        <select className="w-full" onChange={(e) => setCategory(e.target.value)}>
                            <option value="none">None</option>
                            { area !== "none" && categories[area].map((subcategory) => (
                                <option key={subcategory} value={subcategory}>{subcategory}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <select className="w-full" onChange={(e) => setSubcategory(e.target.value)}>
                            <option value="none">None</option>
                            { category !== "none" && subcategories[category].map((subcategory) => (
                                <option key={subcategory} value={subcategory}>{subcategory}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Button onClick={handleSearch}>Search</Button>
            </div>
            <hr className="my-8 border-gray-300" />
            <h2 className="text-lg font-bold">Search Results</h2>
            <p className="mb-4">
                The filter input box will match business number, name, and description. The results are purposely not paginated so that you can quickly refine your list of results for output. This however means that large results lists may cause the browser to lag.
            </p>
            <div className="flex justify-between w-full mb-4">
                <div className="flex">
                    <Input 
                        name="filter" 
                        type="text" 
                        placeholder="Filter results" 
                        onChange={handleFilterSearch} 
                    />
                </div>
                <div className="flex gap-4 justify-center align-middle">
                        <div className="flex items-center">
                            <p>Total Results: {filteredResults.length} of {searchResults.length}</p>
                        </div>
                        <Button onClick={() => {
                            const table = document.createElement('table');
                            filteredResults.forEach(result => {
                                const row = table.insertRow();
                                const accountName = row.insertCell();
                                const url = row.insertCell();
                                const location = row.insertCell();
                                const donations = row.insertCell();
                                const description = row.insertCell();
                                
                                accountName.textContent = result.accountName;
                                url.textContent = createCharityDataUrl(result);
                                location.textContent = `${result.city}, ${result.province}`;
                                donations.textContent = result.sortValue;
                                description.textContent = result.description;
                            });
                            const blob = new Blob([table.outerHTML], {type: 'text/html'});
                            navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
                        }}>Copy Table Data</Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 shadow-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                URL
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Donations
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResults.map((result: any) => (
                            <tr key={result.accountName}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 w-2/12">{result.accountName}</td>
                                <td className="px-6 py-4 text-sm text-gray-500"><a href={createCharityDataUrl(result)} className="text-blue-500 hover:text-blue-800">{createCharityDataUrl(result)}</a></td>
                                <td className="px-6 py-4 text-sm text-gray-500">{result.city}, {result.province}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{result.sortValue}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{result.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

