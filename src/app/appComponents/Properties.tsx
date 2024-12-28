'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Home, Bed, Bath } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface propTypes{

    title: string,
    location: string,
    image: string,
    type: string,
    bedroom: string,
    bathroom: string,
    price: string

}

interface propertyTypes{
    id: string;
  agency: {
    name: string;
    tier: string;
  };
  location: {
    name: string;
  }[];
  coverPhoto: {
    url: string;
  };
  category: {
    name: string;
  }[];
  baths: string;
  price: string;
}

// PropertyCard component
const PropertyCard = ( props: propTypes ) => (
  <Card className="w-full bg-gray-800 text-gray-100">

    <CardHeader>
      <CardTitle>{props.title}</CardTitle>
      <CardDescription className="text-gray-400">{props.location}</CardDescription>
    </CardHeader>

    <CardContent>
      <img src={props.image} alt={props.title} className="w-full h-48 object-cover rounded-md mb-4" />
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          <span>{props.type}</span>
        </div>
        <div className="flex items-center">
          <Bed className="mr-2 h-4 w-4" />
          <span>{props.bedroom} beds</span>
        </div>
        <div className="flex items-center">
          <Bath className="mr-2 h-4 w-4" />
          <span>{props.bathroom} baths</span>
        </div>
      </div>
    </CardContent>

    <CardFooter>
      <p className="text-2xl font-bold text-green-400">${props.price.toLocaleString()}</p>
    </CardFooter>

  </Card>
)

// MAIN COMPONENT
export default function RealEstatePage() {
    // HANDLING THE API CALL FOR FETCHING THE DATA
    useEffect(() => {
        const fetchProperties = async () => {
            const url = 'https://bayut.p.rapidapi.com/properties/list?locationExternalIDs=5002%2C6020&purpose=for-sale&hitsPerPage=25&page=0&lang=en&sort=city-level-score&rentFrequency=monthly&categoryExternalID=4';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '6e37982d35mshb7663aa66c7cf32p13be1djsna53b19653e39',
                    'x-rapidapi-host': 'bayut.p.rapidapi.com'
                }
            };
                
          try {
            const response = await fetch(url, options);
            const data = await response.json();
            const actualData = await data.hits;
            setSaleProperty(actualData);
            console.log(actualData); 
          } catch (error) {
            console.error('Error fetching properties:', error);
          }
        };
    
        // Call the async function inside the useEffect
        fetchProperties();
      }, []);

    const router = useRouter();
    const { status } = useSession();

    const [saleProperty, setSaleProperty] = useState<propertyTypes[]>([]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }
    
    if (status === "unauthenticated") {
        router.push('/');
        return null;
    }

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-gray-100">
            <h1 className="text-2xl font-bold">XenonStack Realestate.</h1>
            <Button variant="outline" className="text-black border-gray-100 hover:bg-gray-700 hover:text-white" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </nav>  

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-2 gap-6">
          {saleProperty.map((property) => (
            <PropertyCard 
                key={property.id} 
                title={property.agency.name}
                location={property.location[0].name}
                image={property.coverPhoto.url}
                type={property.category[1].name}
                bedroom={property.agency.tier}
                bathroom={property.baths}
                price={property.price}
            />
          ))}
        </div>
        <div className="fixed bottom-4 right-4 z-50">
  <script dangerouslySetInnerHTML={{__html: `
    window.embeddedChatbotConfig = {
      chatbotId: "k6EBESpj5_ipz3XRGdyOo",
      domain: "www.chatbase.co",
      position: "right",
      height: "80vh",
      width: "400px",
      theme: "dark"
    }
  `}} />
  <script
    src="https://www.chatbase.co/embed.min.js"
    data-chatbotid="k6EBESpj5_ipz3XRGdyOo"
    data-domain="www.chatbase.co"
    defer
  />
</div>
      </main>
    </div>
  );
}
