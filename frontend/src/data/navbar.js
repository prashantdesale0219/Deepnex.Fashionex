export const navbar =[
    
    {
        id:1,
        title:"Use Cases",
        link:"/use-cases"
    },
    {
        id:2,
        title:"Product",
        link:"/product"
    },
    {
        id:3,
        title:"Resources",
        link:"/",
        hasDropdown: true,
        dropdownItems: [
            {
                id: 1,
                title: "Help Center",
                link: "/help-center",
                icon: "HelpCircle"
            },
            {
                id: 2,
                title: "Blog",
                link: "/blog",
                icon: "FileText"
            },
            {
                id: 3,
                title: "Case Studies",
                link: "/case-studies",
                icon: "BookOpen"
            },
            {
                id: 4,
                title: "FAQs",
                link: "/faq",
                icon: "HelpCircle"
            }
        ]
    },
    {
        id:4,
        title:"Pricing",
        link:"/pricing"
    },
]