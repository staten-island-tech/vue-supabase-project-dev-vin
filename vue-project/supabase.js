 
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cylvlojhkzzjzevgikrk.supabase.co'
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bHZsb2poa3p6anpldmdpa3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1MzQyOTcsImV4cCI6MjAyOTExMDI5N30.sg8czTxmWtQ1AXoQcW0OFd26Ty9_2clYuHDIb0egINY
const supabase = createClient(supabaseUrl, supabaseKey)