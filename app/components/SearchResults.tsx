"use client"

export default function SearchResults({ value }: any) {
    // const createCharityDataUrl = (charity: any) => `charitydata.ca/charity/${charity.name.replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,\/#!$%\^&\*;:{}=`~()]/g,"")}/${charity.bn}`
    return (
        <div>
            { value.map((charity: any) => (
                <div key={charity.metadata.name} className="mb-10">
                    <h3><strong>Name:</strong> {charity.metadata.name} | <strong>Donations:</strong> ${charity.metadata.totalAmountOfGiftsPaidToQualfiiiedDonees.toLocaleString()} | <strong>Revenue:</strong> ${charity.metadata.revenue.toLocaleString()}</h3>
                    <p>{charity.metadata.description}</p>
                    {/* <a href={createCharityDataUrl(charity)} target="_blank">{createCharityDataUrl(charity)}</a> */}
                </div>
            ))}
        </div>
    )
}

