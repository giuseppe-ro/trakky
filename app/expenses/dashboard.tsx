"use client"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Overview, OverviewProps} from "@/app/dashboard/components/overview";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";


export function Dashboard({data}: {data: OverviewProps[] }) {

    return (
            <div className="mx-auto py-6 min-w-460">
                <Tabs defaultValue="year-overview">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="year-overview">Year Overview</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="year-overview">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>2023 Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview data={data} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
    )
}
