import { useState, useEffect } from 'react';
import { LocalInsight } from '@/types';

export function useInsights() {
  const [insights, setInsights] = useState<LocalInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    // In a real app, this would be fetched from a backend
    const fetchInsights = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 700));

        // Mock insight data
        // Mock insight data
        const mockInsights: LocalInsight[] = [
          {
            id: '1',
            title: 'Gorilla Trekking in Volcanoes National Park',
            description: `Volcanoes National Park is one of the most renowned conservation areas in Africa, famous for being home to the endangered mountain gorillas. Nestled in the Virunga Mountains, this biodiverse region offers travelers a rare chance to observe gorilla families in their natural habitat. Each trek is limited to a small group to ensure minimal impact on the gorillas.

The journey itself is part of the experience—trekkers traverse lush rainforests, misty slopes, and bamboo forests under the guidance of expert rangers. Trek lengths can vary from 1 to 6 hours, depending on the location of the gorilla groups. A moderate level of fitness is recommended.

Permits are required and must be secured in advance through the Rwanda Development Board. Though costly, the permit fee supports conservation efforts and local communities. Visitors are encouraged to bring waterproof gear, good hiking boots, and plenty of water.`,
            category: 'wildlife',
            imageUrl:
              'https://www.timelesstravel.co.uk/wp-content/uploads/2023/12/rwanda-gorilla-trekking.jpg',
          },
          {
            id: '2',
            title: 'Exploring Kigali: Rwanda’s Capital',
            description: `Kigali stands out as one of Africa’s cleanest and safest capitals. With a modern skyline, green hills, and a deep cultural heartbeat, it offers an excellent introduction to Rwandan life. The city has a well-organized infrastructure, with clear roads, accessible transportation, and a growing tech sector.

Visitors can explore the Kigali Genocide Memorial for a profound insight into Rwanda’s history and resilience. Art lovers will enjoy the Inema Arts Center and various galleries scattered throughout the city. Food enthusiasts can dine on Rwandan cuisine, such as brochettes and isombe, or enjoy international options in stylish cafes and restaurants.

Getting around Kigali is easy. Ride-hailing services like Yego or moto-taxis are affordable and convenient. The city also promotes sustainable living, with initiatives such as monthly car-free days and a strong focus on environmental cleanliness.`,
            category: 'city',
            imageUrl:
              'https://ugandarwandagorillatours.com/wp-content/uploads/2019/09/Areial-View-Of-Kigali-1.jpg',
          },
          {
            id: '3',
            title: 'Nyandungu Eco-Park: A Green Oasis in Kigali',
            description: `Nyandungu Urban Wetland Eco-Tourism Park is a shining example of Rwanda's commitment to sustainable development and urban biodiversity. Once a degraded wetland, this 120-hectare space has been transformed into a lush sanctuary for flora, fauna, and people. The park opened in 2022 and has since become a popular spot for recreation and education.

Visitors can enjoy peaceful walks along wooden boardwalks, picnic in shaded rest areas, or observe birds and native plants. Educational signage throughout the park explains the ecological importance of wetlands and Rwanda’s environmental protection strategies. The park also features medicinal gardens showcasing traditional healing plants.

Nyandungu is easily accessible from Kigali’s city center, making it a must-visit for eco-conscious travelers, families, or anyone seeking tranquility amid urban life. Entry is free, and guided tours are available for a deeper understanding of the site’s transformation and biodiversity.`,
            category: 'ecotourism',
            imageUrl:
              'https://www.ktpress.rw/wp-content/uploads/2022/07/Nyandungu-16.jpg',
          },
          {
            id: '4',
            title: 'Musanze: Base for Volcano Adventures',
            description: `Located in Rwanda’s northwestern region, Musanze is a scenic town surrounded by rolling hills and volcanoes. It's the main base for travelers heading to Volcanoes National Park, making it a bustling hub of activity during the gorilla trekking season. Despite its tourism appeal, Musanze retains a local charm with vibrant markets, cultural centers, and friendly residents.

The Dian Fossey Gorilla Fund has a public campus here, offering an immersive conservation learning experience. You can also visit the Musanze Caves, formed by lava flows over 65 million years ago. Guided tours through these caves highlight Rwanda's fascinating geological history.

With its stunning views, temperate climate, and easy access to adventure, Musanze is not just a stopover, but a destination in its own right. Boutique lodges and guesthouses cater to all types of travelers, while local restaurants serve up hearty Rwandan dishes and fresh mountain produce.`,
            category: 'city',
            imageUrl:
              'https://cdn.audleytravel.com/1421/1015/79/348652-the-road-from-ruhengeri-to-the-volcanoes-national-park.jpg',
          },
          {
            id: '5',
            title: 'Mount Bisoke Crater Hike',
            description: `Mount Bisoke, standing at 3,711 meters, is one of the most popular volcano hikes in Rwanda. Located in Volcanoes National Park, it offers a challenging yet rewarding adventure for hikers. The summit reveals a stunning crater lake surrounded by clouds and alpine flora.

The hike typically takes about 6 hours round-trip and requires a guide provided by the park. Trekkers pass through thick rainforest, home to golden monkeys and various bird species. While the trail is steep and can be slippery, the well-maintained paths and ranger support make it manageable for those with moderate fitness.

Preparation is key—hikers should bring waterproof clothing, hiking boots, snacks, and water. The mountain weather can change quickly, so layering is advised. A permit is required, and the hike can be combined with cultural village visits or overnight stays in Musanze.`,
            category: 'adventure',
            imageUrl:
              'https://www.volcanoesnationalpark.com/wp-content/uploads/2024/10/bisoke-volcanoes-1024x482-1.jpg',
          },
          {
            id: '6',
            title: 'Conservation at Akagera National Park',
            description: `Akagera National Park is Rwanda’s premier savannah park, offering classic African safari experiences. Once heavily poached, the park has undergone a stunning transformation thanks to partnerships between the Rwanda Development Board and African Parks. Today, it’s home to the Big Five—lions, elephants, leopards, rhinos, and buffalo.

The park’s ecosystem includes open plains, woodlands, wetlands, and lakes. Game drives, boat safaris on Lake Ihema, and birdwatching excursions offer varied ways to explore its biodiversity. Akagera is also known for community engagement, with many local Rwandans employed as rangers and guides.

Akagera is accessible by road from Kigali (roughly 2.5 hours). It’s a shining example of how conservation and tourism can co-exist sustainably. Lodges within the park range from budget to luxury, and self-drive options are available for experienced safari-goers.`,
            category: 'wildlife',
            imageUrl:
              'https://www.insideakageranationalpark.com/wp-content/uploads/2023/12/gentle-elephants-in-akagera.jpg',
          },
          {
            id: '7',
            title: 'Cultural Heritage in Huye (Butare)',
            description: `Huye, formerly known as Butare, is the intellectual and cultural capital of Rwanda. Located in the southern part of the country, it is home to the University of Rwanda and the Ethnographic Museum, which offers one of the most comprehensive collections of Rwandan cultural artifacts.

Visitors can explore exhibits on traditional clothing, agricultural tools, musical instruments, and ancient religious practices. The museum is an essential stop for those who want to gain a deeper understanding of Rwanda beyond its landscapes.

In addition to the museum, Huye features quiet streets, colonial-era buildings, and a peaceful atmosphere ideal for reflection and learning. It’s also a gateway to nearby tea plantations and scenic highlands, offering a relaxed but enriching experience for cultural travelers.`,
            category: 'cultural',
            imageUrl:
              'https://www.africangorilla.com/wp-content/uploads/2022/05/Kings-Palace-Museum-in-Nyanza-1024x768.jpg',
          },
        ];

        setInsights(mockInsights);
      } catch (err) {
        setError('Failed to fetch insights');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return { insights, isLoading, error };
}
