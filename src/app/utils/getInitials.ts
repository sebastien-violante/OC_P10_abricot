import type { User } from "@/types/types"

export default function getInitials(name: User['name'] | undefined): string {
    
    if(!name) return ""
    
    const parts= name.split(' ')
    let initials = ""
    for( let index = 0; index < parts.length; index ++) {
        initials+=parts[index][0].toUpperCase()
    }
    return initials
       
}